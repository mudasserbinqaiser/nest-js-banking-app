export class User {
    id: number;
    email: string;
    password: string;
    name: string;
    role: 'customer' | 'admin' | 'banker'; // User roles
  }
  