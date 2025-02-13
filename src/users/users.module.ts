import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AccountsModule } from 'src/accounts/accounts.module';
import { LoggingModule } from 'src/logging/logging.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [forwardRef(() => AccountsModule), LoggingModule, NotificationsModule], // ✅ Fix circular dependency
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
