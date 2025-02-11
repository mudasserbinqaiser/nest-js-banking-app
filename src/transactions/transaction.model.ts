export class Transaction {
    id: number;
    fromAccountId: number; // Sender's account
    toAccountId: number; // Receiver's account
    amount: number;
    timestamp: Date;
    status: 'pending' | 'completed' | 'failed';
  }
  