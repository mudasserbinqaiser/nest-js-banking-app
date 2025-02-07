import { Injectable, Inject, forwardRef, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AccountsService } from 'src/accounts/accounts.service';


@Injectable()
export class UsersService {
  private users: User[] = []; // Temporary in-memory storage

  constructor(
    @Inject(forwardRef(() => AccountsService)) // ✅ Fix circular dependency
    private readonly accountsService: AccountsService
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  async findById(id: number): Promise<User | undefined> {
    return this.users.find((user) => user.id === id);
  }

  async createUser(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { email, password, name, role } = createUserDto;

    // Check if user already exists
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: this.users.length + 1,
      email,
      password: hashedPassword,
      name,
      role,
    };

    this.users.push(newUser);

    // Automatically create an account for customers
    if (role === 'customer') {
      await this.accountsService.createAccount(newUser.id, 'savings');
    }

    return this.excludePassword(newUser);
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<Omit<User, 'password'>> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.name = updateUserDto.name;
    return this.excludePassword(user);
  }

  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    return this.users.map(user => this.excludePassword(user));
  }

  private excludePassword(user: User): Omit<User, 'password'> {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}