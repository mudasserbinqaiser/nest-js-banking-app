import { Injectable, NotFoundException, BadRequestException, Inject, forwardRef } from '@nestjs/common';
import { Transaction } from './transaction.model';
import { AccountsService } from '../accounts/accounts.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { TransactionResponseDto } from './dto/transaction-response.dto';

@Injectable()
export class TransactionsService {
  private transactions: Transaction[] = []; // In-memory transaction storage

  constructor(
    @Inject(forwardRef(() => AccountsService)) // Inject AccountsService to access accounts
    private readonly accountsService: AccountsService,
  ) {}

  async transferFunds(transferDto: CreateTransactionDto): Promise<TransactionResponseDto> {
    const { fromAccountId, toAccountId, amount } = transferDto;

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than zero');
    }

    const fromAccount = await this.accountsService.getAccountById(fromAccountId);
    const toAccount = await this.accountsService.getAccountById(toAccountId);

    if (!fromAccount || !toAccount) {
      throw new NotFoundException('One or both accounts not found');
    }

    if (fromAccount.balance < amount) {
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

    // Return transaction response DTO
    return this.toTransactionResponseDto(newTransaction);
  }

  async getTransactionById(transactionId: number): Promise<TransactionResponseDto> {
    const transaction = this.transactions.find((tx) => tx.id === transactionId);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return this.toTransactionResponseDto(transaction);
  }

  async getTransactionsByAccountId(accountId: number): Promise<TransactionResponseDto[]> {
    return this.transactions
      .filter((tx) => tx.fromAccountId === accountId || tx.toAccountId === accountId)
      .map((tx) => this.toTransactionResponseDto(tx));
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
