import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef, InternalServerErrorException } from '@nestjs/common';
import { Transaction } from './transaction.model';
import { AccountsService } from '../accounts/accounts.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';
import { LoggingService } from 'src/logging/logging.service';

@Injectable()
export class TransactionsService {
  private transactions: Transaction[] = []; // In-memory transaction storage

  constructor(
    @Inject(forwardRef(() => AccountsService)) // Inject AccountsService to access accounts
    private readonly accountsService: AccountsService,
    private readonly loggingService: LoggingService,

  ) {}

  async transferFunds(transferDto: CreateTransactionDto): Promise<TransactionResponseDto> {
    try {
      const { fromAccountId, toAccountId, amount } = transferDto;

      this.loggingService.log(
        `Initiating transfer of ${amount} from ${fromAccountId} to ${toAccountId}`,
        'TransactionsService',
      );

      if (amount <= 0) {
        this.loggingService.warn(`Invalid transfer amount: ${amount}`, 'TransactionsService');
        throw new BadRequestException('Amount must be greater than zero');
      }

      const fromAccount = await this.accountsService.getAccountById(fromAccountId);
      const toAccount = await this.accountsService.getAccountById(toAccountId);

      if (!fromAccount || !toAccount) {
        this.loggingService.warn(`Invalid account(s) involved in transfer`, 'TransactionsService');
        throw new NotFoundException('One or both accounts not found');
      }

      if (fromAccount.balance < amount) {
        this.loggingService.warn(`Insufficient funds for transfer from account ${fromAccountId}`, 'TransactionsService');
        throw new BadRequestException('Insufficient funds');
      }

      // Deduct from sender
      fromAccount.balance -= amount;

      // Credit to receiver
      toAccount.balance += amount;

      // Record the transaction
      const newTransaction: Transaction = {
        id: this.transactions.length + 1,
        fromAccountId,
        toAccountId,
        amount,
        timestamp: new Date(),
        status: 'completed',
      };

      this.transactions.push(newTransaction);

      this.loggingService.log(
        `Transfer was successful: ${amount} from ${fromAccountId} to ${toAccountId}`,
        'TransactionsService',
      );

      return this.toTransactionResponseDto(newTransaction);
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'An error occurred during the transaction');
    }
  }

  async getTransactionById(transactionId: number): Promise<TransactionResponseDto> {
    const transaction = this.transactions.find((tx) => tx.id === transactionId);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return this.toTransactionResponseDto(transaction);
  }

  async getTransactionsByAccountId(accountId: number): Promise<TransactionResponseDto[]> {
    try {
      return this.transactions
        .filter((tx) => tx.fromAccountId === accountId || tx.toAccountId === accountId)
        .map((tx) => this.toTransactionResponseDto(tx));
    } catch (error) {
      throw new InternalServerErrorException(error.message || 'An error occurred during the transaction');
    }
  }

  private toTransactionResponseDto(transaction: Transaction): TransactionResponseDto {
    return {
      id: transaction.id,
      fromAccountId: transaction.fromAccountId,
      toAccountId: transaction.toAccountId,
      amount: transaction.amount,
      timestamp: transaction.timestamp,
      status: transaction.status,
    };
  }
}
