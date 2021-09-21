import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { HttpServiceError } from '../common/interfaces/http-service-error.interface';
import { Config, Services } from '../common/config/configuration';
import { NoListingsError } from './errors/no-listings.error';
import { HttpService } from '@nestjs/axios';
import { Snapshot } from './interfaces/snapshot.interface';

@Injectable()
export class SnapshotService {
  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly httpService: HttpService,
  ) {}

  getSnapshot(sku: string): Promise<Snapshot> {
    const url = `${
      this.configService.get<Services>('services').snapshot
    }/listings/${sku}`;

    return this.httpService
      .get(url)
      .toPromise()
      .then((response) => response.data)
      .catch((err: AxiosError<HttpServiceError>) => {
        if (err.isAxiosError) {
          if (err.response?.data.message === 'No listings saved for item') {
            throw new NoListingsError(err.response.data.message);
          }
        }

        throw err;
      });
  }

  async refreshListings(sku: string, delay?: number): Promise<void> {
    const url = `${
      this.configService.get<Services>('services').snapshot
    }/listings/${sku}/refresh`;

    const data: { delay?: number } = {};

    if (delay !== undefined && delay > 0) {
      data.delay = delay;
    }

    await this.httpService.post(url, data).toPromise();
  }
}
