export class TransactionResponseDto {
    id: number;
    fromAccountId: number;
    toAccountId: number;
    amount: number;
    timestamp: Date;
    status: 'pending' | 'completed' | 'failed';
  }
  