import { Module, forwardRef } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { AccountsModule } from '../accounts/accounts.module';
import { LoggingModule } from 'src/logging/logging.module';

@Module({
  imports: [forwardRef(() => AccountsModule), LoggingModule], // ✅ Import AccountsModule
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}