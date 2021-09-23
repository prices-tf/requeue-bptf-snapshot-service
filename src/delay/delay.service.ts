import {
  RabbitSubscribe,
  requeueErrorHandler,
} from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { NoListingsError } from '../snapshot/errors/no-listings.error';
import { ListingService } from '../listing/listing.service';
import { Snapshot } from '../snapshot/interfaces/snapshot.interface';
import { SnapshotService } from '../snapshot/snapshot.service';
import { Config, DelayConfig } from '../common/config/configuration';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { HttpServiceError } from '../common/interfaces/http-service-error.interface';

@Injectable()
export class DelayService {
  private readonly logger = new Logger(DelayService.name);

  constructor(
    private readonly snapshotService: SnapshotService,
    private readonly listingService: ListingService,
    private readonly configService: ConfigService<Config>,
  ) {}

  @RabbitSubscribe({
    exchange: 'bptf-listing.handled',
    routingKey: '*',
    queue: 'requeueSnapshot',
    queueOptions: {
      arguments: {
        'x-queue-type': 'quorum',
      },
    },
    errorHandler: requeueErrorHandler,
  })
  private async handleSnapshot(snapshot: Snapshot): Promise<void> {
    this.logger.log('Handling snapshot for ' + snapshot.sku + '...');

    const delay = await this.calculateDelay(snapshot);

    this.logger.log(
      'Requesting snapshot for ' +
        snapshot.sku +
        ' with delay of ' +
        delay +
        ' ms...',
    );

    await this.snapshotService
      .refreshListings(snapshot.sku, delay)
      .catch((err: AxiosError<HttpServiceError>) => {
        if (err.isAxiosError) {
          if (err.response?.status >= 400 && err.response?.status < 500) {
            // Ignore error
            return;
          }
        }

        throw err;
      });
  }

  async getBySKU(sku: string): Promise<number> {
    const snapshot = await this.snapshotService
      .getSnapshot(sku)
      .catch((err) => {
        if (err instanceof NoListingsError) {
          return null;
        }

        throw err;
      });

    return this.calculateDelay(snapshot);
  }

  private async calculateDelay(snapshot: Snapshot): Promise<number> {
    if (snapshot === null) {
      return null;
    }

    const listings = await this.listingService.getListings(
      snapshot.sku,
      'sell',
    );

    const averageAge =
      listings.items.reduce((accumulator, a) => {
        const firstSeenAt = new Date(a.firstSeenAt);
        const lastSeenAt = new Date(a.lastSeenAt);

        return accumulator + lastSeenAt.getTime() - firstSeenAt.getTime();
      }, 0) / listings.items.length;

    const sell = snapshot.listings.filter(
      (listing) => listing.intent === 'sell',
    );

    const createdAt = new Date(snapshot.createdAt);

    const snapshotAge = new Date().getTime() - createdAt.getTime();

    const delayConfig = this.configService.get<DelayConfig>('delay');

    const delay = sell.length === 0 ? averageAge : averageAge / sell.length;

    // Make sure delay is between min and max
    const clampedDelay = isNaN(averageAge)
      ? delayConfig.max
      : Math.max(
          delayConfig.min,
          Math.min(
            delayConfig.max,
            // Randomize delay
            delay - delayConfig.randomized * Math.random(),
          ),
        );

    // Don't delay if snapshot is already old
    return Math.round(Math.max(0, clampedDelay - snapshotAge));
  }
}
