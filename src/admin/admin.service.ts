import { Injectable, NotFoundException, ConflictException, Inject, forwardRef, InternalServerErrorException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AccountsService } from 'src/accounts/accounts.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import { LoggingService } from 'src/logging/logging.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly loggingService: LoggingService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AccountsService))
    private readonly accountsService: AccountsService,
    @Inject(forwardRef(() => TransactionsService))
    private readonly transactionsService: TransactionsService,
  ) {}

  async banUser(userId: number) {
    try {
      this.loggingService.log(`Attempting to ban user ${userId}`, 'AdminService');
      const user = await this.usersService.findById(userId);
      if (!user) {
        this.loggingService.warn(`Attempted to ban non-existent user ${userId}`, 'AdminService');
        throw new NotFoundException('User not found');
      }

      user.isBanned = true;
      this.loggingService.log(`User ${userId} has been banned successfully`, 'AdminService');
      return { message: `User ${userId} has been banned` };
    } catch (error) {
      this.loggingService.error(`Error banning user: ${error.message}`, error.stack, 'AdminService');
      throw new InternalServerErrorException(error.message || 'An error occurred while banning the user');
    }
  }

  async suspendAccount(accountId: number) {
    try {
      this.loggingService.log(`Attempting to suspend account ${accountId}`, 'AdminService');
      const account = await this.accountsService.getAccountById(accountId);
      if (!account) {
        this.loggingService.warn(`Attempted to suspend non-existent account ${accountId}`, 'AdminService');
        throw new NotFoundException('Account not found');
      }

      account.isSuspended = true;
      this.loggingService.log(`Account ${accountId} has been suspended successfully`, 'AdminService');
      return { message: `Account ${accountId} has been suspended` };
    } catch (error) {
      this.loggingService.error(`Error suspending account: ${error.message}`, error.stack, 'AdminService');
      throw new InternalServerErrorException(error.message || 'An error occurred while suspending the account');
    }
  }

  async getAllUsers() {
    try {
      this.loggingService.log('Admin is fetching all users', 'AdminService');
      const users = await this.usersService.getAllUsers();

      if (!users.length) {
        this.loggingService.warn('No users found in the system', 'AdminService');
        throw new NotFoundException('No users found');
      }

      this.loggingService.log('Successfully fetched all users', 'AdminService');
      return users;
    } catch (error) {
      this.loggingService.error(`Error fetching users: ${error.message}`, error.stack, 'AdminService');
      throw new InternalServerErrorException(error.message || 'An error occurred while fetching users');
    }
  }

  async getAllTransactions() {
    try {
      this.loggingService.log('Admin is fetching all transactions', 'AdminService');
      const transactions = await this.transactionsService.getAllTransactions();

      if (!transactions.length) {
        this.loggingService.warn('No transactions found in the system', 'AdminService');
        throw new NotFoundException('No transactions found');
      }

      this.loggingService.log('Successfully fetched all transactions', 'AdminService');
      return transactions;
    } catch (error) {
      this.loggingService.error(`Error fetching transactions: ${error.message}`, error.stack, 'AdminService');
      throw new InternalServerErrorException(error.message || 'An error occurred while fetching transactions');
    }
  }
}
