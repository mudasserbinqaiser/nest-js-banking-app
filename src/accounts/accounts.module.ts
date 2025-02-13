import { Module, forwardRef } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { UsersModule } from 'src/users/users.module';
import { LoggingService } from 'src/logging/logging.service';
import { LoggingModule } from 'src/logging/logging.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    LoggingModule,
    NotificationsModule,
  ],
  providers: [AccountsService],
  controllers: [AccountsController],
  exports: [AccountsService],
})
export class AccountsModule {}
