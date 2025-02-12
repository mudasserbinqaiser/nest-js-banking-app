import { Injectable, Inject, forwardRef, NotFoundException, BadRequestException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { Account } from './account.model';
import { UsersService } from 'src/users/users.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { AddFundsDto } from './dto/add-funds.dto';
import { LoggingService } from 'src/logging/logging.service';

@Injectable()
export class AccountsService {
  private accounts: Account[] = []; // In-memory storage for accounts

  constructor(
    @Inject(forwardRef(() => UsersService)) // ✅ Fix circular dependency
    private readonly usersService: UsersService,
    private readonly loggingService: LoggingService,
  ) {}

  async createAccount(createAccountDto: CreateAccountDto): Promise<Account> {

    try {
      const { userId, type } = createAccountDto;
      this.loggingService.log(`Creating account for user ${userId} with type ${type}`, 'AccountsService');

      // Validate user existence
      const user = await this.usersService.findById(userId);
      if (!user) {
        this.loggingService.warn(`User ${userId} not found while creating account`, 'AccountsService');
        throw new NotFoundException('User not found');
      }
  
      // Check if an account of the same type already exists for the user
      const existingAccount = await this.getAccountsByUserId(user.id);
      if (!existingAccount) {
        this.loggingService.warn(`User ${userId} already has a ${type} account`, 'AccountsService');
        throw new ConflictException(`User already has a ${type} account`);
      }

      const newAccount: Account = {
        id: this.accounts.length + 1,
        accountNumber: this.generateAccountNumber(),
        balance: 0, // New accounts start with a balance of 0
        type: type,
        userId,
      };
      this.accounts.push(newAccount);
      this.loggingService.log(`Account created successfully for user ${userId}`, 'AccountsService');
      return newAccount;
    } catch (error) {
      this.loggingService.error(`Error creating account: ${error.message}`, error.stack, 'AccountsService');
      throw new InternalServerErrorException(
        error.message || 'An error occurred while creating the account'
      );
    }
  }

  async addFunds(addFundsDto: AddFundsDto): Promise<Account> {
    const {userId, amount} = addFundsDto
    this.loggingService.log(`Adding funds: ${amount} to user ${userId}`, 'AccountsService');
    const user = await this.usersService.findById(userId);
    if (!user) {
      this.loggingService.warn(`User ${userId} not found while adding funds`, 'AccountsService');
      throw new NotFoundException('User not found');
    }

    const account = this.accounts.find((acc) => acc.userId === userId);
    if (!account) {
      this.loggingService.warn(`Account for user ${userId} not found`, 'AccountsService');
      throw new NotFoundException('Account not found');
    }

    if (amount <= 0) {
      this.loggingService.warn(`Invalid deposit amount: ${amount}`, 'AccountsService');
      throw new BadRequestException('Deposit amount must be greater than zero');
    }

    // Add funds to the account balance
    account.balance += amount;
    this.loggingService.log(`Successfully added ${amount} to account ${account.id}`, 'AccountsService');

    return account;
  }

  async getAccountById(accountId: number): Promise<Account> {
    const account = this.accounts.find((acc) => acc.id === accountId);
    if (!account) {
      this.loggingService.warn(`Account not found`, 'AccountsService');
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
