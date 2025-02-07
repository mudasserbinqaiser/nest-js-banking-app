import { Injectable, Inject, forwardRef, NotFoundException } from '@nestjs/common';
import { Account } from './account.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AccountsService {
  private accounts: Account[] = []; // In-memory storage for accounts

  constructor(
    @Inject(forwardRef(() => UsersService)) // ✅ Fix circular dependency
    private readonly usersService: UsersService,
  ) {}
  
  async createAccount(userId: number, accountType: 'savings' | 'checking' | 'business'): Promise<Account> {

    // Validate user existence
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newAccount: Account = {
      id: this.accounts.length + 1,
      accountNumber: this.generateAccountNumber(),
      balance: 0, // New accounts start with a balance of 0
      type: accountType,
      userId,
    };
    this.accounts.push(newAccount);
    return newAccount;
  }

  async getAccountById(accountId: number): Promise<Account> {
    const account = this.accounts.find((acc) => acc.id === accountId);
    if (!account) {
      throw new NotFoundException('Account not found');
    }
    return account;
  }

  async getAccountsByUserId(userId: number): Promise<Account[]> {
    return this.accounts.filter((acc) => acc.userId === userId);
  }

  private generateAccountNumber(): string {
    return Math.random().toString().slice(2, 12); // Generates a 10-digit account number
  }
}
