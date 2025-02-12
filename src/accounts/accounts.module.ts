import { Module, forwardRef } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { UsersModule } from 'src/users/users.module';
import { LoggingService } from 'src/logging/logging.service';
import { LoggingModule } from 'src/logging/logging.module';

@Module({
  imports: [forwardRef(() => UsersModule), LoggingModule], // ✅ Fix circular dependency
  providers: [AccountsService],
  controllers: [AccountsController],
  exports: [AccountsService],
})
export class AccountsModule {}
