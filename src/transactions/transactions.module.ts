import { Module, forwardRef } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { AccountsModule } from '../accounts/accounts.module';

@Module({
  imports: [forwardRef(() => AccountsModule)], // ✅ Import AccountsModule
  providers: [TransactionsService],
  controllers: [TransactionsController],
})
export class TransactionsModule {}
