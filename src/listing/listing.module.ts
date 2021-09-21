import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ListingService } from './listing.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [ListingService],
  exports: [ListingService],
})
export class ListingModule {}
