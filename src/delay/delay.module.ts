import { Module } from '@nestjs/common';
import { DelayService } from './delay.service';
import { DelayController } from './delay.controller';
import { SnapshotModule } from '../snapshot/snapshot.module';
import { RabbitMQWrapperModule } from '../rabbitmq-wrapper/rabbitmq-wrapper.module';
import { ListingModule } from '../listing/listing.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, SnapshotModule, ListingModule, RabbitMQWrapperModule],
  controllers: [DelayController],
  providers: [DelayService],
})
export class DelayModule {}
