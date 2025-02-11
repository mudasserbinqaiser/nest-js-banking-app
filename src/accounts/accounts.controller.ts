import { Controller, Post, Get, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { JwtAuthGuard } from 'src/auth/guards/auth.guard';
import { CreateAccountDto } from './dto/create-account.dto';
import { AddFundsDto } from './dto/add-funds.dto';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createAccount(
    @Body() createAccountDto: CreateAccountDto,
  ) {
    return this.accountsService.createAccount(createAccountDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-funds')
  async addFunds(
    @Body() addFundsDto: AddFundsDto,
  ) {
    return this.accountsService.addFunds(addFundsDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getAccountById(@Param('id', ParseIntPipe) id: number) {
    return this.accountsService.getAccountById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async getAccountsByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.accountsService.getAccountsByUserId(userId);
  }
}
