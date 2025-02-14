import { Module } from '@nestjs/common';
import { ReportingController } from './reporting.controller';
import { ReportingService } from './reporting.service';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { LoggingModule } from 'src/logging/logging.module';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [
    LoggingModule,
    NotificationsModule,
    TransactionsModule
  ],
  controllers: [ReportingController],
  providers: [ReportingService]
})
export class ReportingModule {}
