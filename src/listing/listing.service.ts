import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Paginated } from '../common/interfaces/paginated.interface';
import { Config, Services } from '../common/config/configuration';
import { Listing } from './interfaces/listing.interface';

@Injectable()
export class ListingService {
  constructor(
    private readonly configService: ConfigService<Config>,
    private readonly httpService: HttpService,
  ) {}

  getListings(
    sku: string,
    intent: 'buy' | 'sell',
    order: 'ASC' | 'DESC',
    orderBy: string,
    page?: number,
    limit?: number,
  ): Promise<Paginated<Listing>> {
    const url = `${
      this.configService.get<Services>('services').listing
    }/listings/sku/${sku}`;

    return this.httpService
      .get(url, {
        params: {
          intent,
          order,
          orderBy,
          page,
          limit,
        },
      })
      .toPromise()
      .then((response) => response.data);
  }
}
