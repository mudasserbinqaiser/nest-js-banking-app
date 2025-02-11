import { Injectable, UnauthorizedException  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { privateDecrypt } from 'crypto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginInDto } from './dto/log-in.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly JwtService: JwtService,
    ){}
    //  Use dtos
    async validateUser(loginDto: LoginInDto): Promise<UserResponseDto> {
        const {email, password} = loginDto
        const user = await this.userService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {  //clean code
            const { password, ...userData } = user;
            return userData as UserResponseDto
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    // Never use any, use object
    async login(user:any) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            access_token: this.JwtService.signAsync(payload),
        }
    }
}
