import { forwardRef, Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsersModule } from 'src/users/users.module';
import { AccountsModule } from 'src/accounts/accounts.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { LoggingModule } from 'src/logging/logging.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => AccountsModule),
    forwardRef(() => TransactionsModule),
    LoggingModule,
    NotificationsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
