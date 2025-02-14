import { Module } from '@nestjs/common';
import { StatementScheduler } from './utils/statement.scheduler';
import { ReportingService } from 'src/reporting/reporting.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UsersService } from 'src/users/users.service';
import { LoggingService } from 'src/logging/logging.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import { AccountsService } from 'src/accounts/accounts.service';

@Module({
  providers: [
    StatementScheduler,
    ReportingService,
    NotificationsService,
    UsersService,
    LoggingService,
    TransactionsService,
    AccountsService
],
})
export class StatementsModule {}
