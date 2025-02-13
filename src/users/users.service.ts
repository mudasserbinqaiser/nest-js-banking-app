import { Injectable, Inject, forwardRef, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccountsService } from 'src/accounts/accounts.service';
import { CreateAccountDto } from 'src/accounts/dto/create-account.dto';
import { LoggingService } from 'src/logging/logging.service';


@Injectable()
export class UsersService {
  private users: User[] = []; // Temporary in-memory storage

  constructor(
    @Inject(forwardRef(() => AccountsService)) // ✅ Fix circular dependency
    private readonly accountsService: AccountsService,
    private readonly loggingService: LoggingService,

  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    
    try {
      return this.users.find((user) => user.email === email);
    } catch (error) {
      throw new NotFoundException(error)
    }
  }

  async findById(id: number): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async createUser(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { email, password, name, role } = createUserDto;
    this.loggingService.log(`Creating new user: ${email}`, 'UsersService');

    try {
      // Check if user already exists
      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        this.loggingService.warn(`Attempted to create duplicate user: ${email}`, 'UsersService');
        throw new ConflictException('User with this email already exists');
      }
    } catch (error) {
      if (!(error instanceof NotFoundException)) throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: this.users.length + 1,
      email,
      password: hashedPassword,
      name,
      role,
      requiresTwoFactorAuth: false,
      isTwoFactorAuthenticated: false,
      isBanned: false,
    };

    this.users.push(newUser);
    this.loggingService.log(`User created successfully: ${email}`, 'UsersService');

    // Automatically create an account for customers
    if (role === 'customer') {
      this.loggingService.log(`Creating default savings account for ${email}`, 'UsersService');

      try {
        const createAccountDto = new CreateAccountDto();
        createAccountDto.userId = newUser.id;
        createAccountDto.type = 'savings';
        await this.accountsService.createAccount(createAccountDto);
        this.loggingService.log(`Default savings account created for ${email}`, 'UsersService');
      } catch (error) {
        this.loggingService.error(`Failed to create default account for ${email}: ${error.message}`, error.stack, 'UsersService');
        throw new InternalServerErrorException('Failed to create default savings account');
      }
    }

    return this.excludePassword(newUser);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    try {
      const user = await this.findById(id);
      if (!user) {
        this.loggingService.warn(`Attempted to update non-existent user ID: ${id}`, 'UsersService');
        throw new NotFoundException('User not found');
      }

      user.name = updateUserDto.name;
      this.loggingService.log(`User ${id} updated successfully`, 'UsersService');
      return this.excludePassword(user);
    } catch (error) {
      this.loggingService.error(`Error updating user: ${error.message}`, error.stack, 'UsersService');
      throw new InternalServerErrorException(error.message || 'An error occurred while updating user');
    }
  }

  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    return this.users.map(user => this.excludePassword(user));
  }

  private excludePassword(user: User): Omit<User, 'password'> {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}