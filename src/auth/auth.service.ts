import { Injectable, UnauthorizedException  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { privateDecrypt } from 'crypto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly JwtService: JwtService,
    ){}

    // use DTO here.
    async validateUser(email:string, password:string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result} = user;
            return result // Return user data without password
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    async login(user:any) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            access_token: this.JwtService.sign(payload),
        }
    }
}
