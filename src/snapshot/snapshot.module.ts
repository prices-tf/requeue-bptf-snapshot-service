import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SnapshotService } from './snapshot.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [SnapshotService],
  exports: [SnapshotService],
})
export class SnapshotModule {}
