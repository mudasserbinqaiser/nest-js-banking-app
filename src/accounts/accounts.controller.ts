import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createAccount(
    @Body() createAccountDto: { userId: string; type: 'savings' | 'checking' | 'business' },
  ) {
    return this.accountsService.createAccount(+createAccountDto.userId, createAccountDto.type);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-funds')
  async addFunds(
    @Body() addFundsDto: { userId: string; amount: number},
  ) {
    return this.accountsService.addFunds(+addFundsDto.userId, addFundsDto.amount);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getAccountById(@Param('id') id: number) {
    return this.accountsService.getAccountById(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async getAccountsByUserId(@Param('userId') userId: string) {
    return this.accountsService.getAccountsByUserId(+userId);
  }
}
