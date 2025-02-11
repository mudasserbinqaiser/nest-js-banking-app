import { Injectable, Inject, forwardRef, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { Account } from './account.model';
import { UsersService } from 'src/users/users.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { AddFundsDto } from './dto/add-funds.dto';

@Injectable()
export class AccountsService {
  private accounts: Account[] = []; // In-memory storage for accounts

  constructor(
    @Inject(forwardRef(() => UsersService)) // ✅ Fix circular dependency
    private readonly usersService: UsersService,
  ) {}

  async createAccount(createAccountDto: CreateAccountDto): Promise<Account> {

    try {
      const { userId, type } = createAccountDto;
      // Validate user existence
      const user = await this.usersService.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
  
      const newAccount: Account = {
        id: this.accounts.length + 1,
        accountNumber: this.generateAccountNumber(),
        balance: 0, // New accounts start with a balance of 0
        type: type,
        userId,
      };
      this.accounts.push(newAccount);
      return newAccount;

    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'An error occurred while creating the account'
      );
    }
  }

  async addFunds(addFundsDto: AddFundsDto): Promise<Account> {
    const {userId, amount} = addFundsDto
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const account = await this.getAccountById(userId);
    if (!account) {
        throw new NotFoundException('Account not found');
    }

    if (amount <= 0) {
        throw new BadRequestException('Deposit amount must be greater than zero');
    }

    // Add funds to the account balance
    account.balance += amount;

    return account;
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
