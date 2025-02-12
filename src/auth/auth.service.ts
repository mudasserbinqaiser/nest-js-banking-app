import { Injectable, UnauthorizedException  } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { privateDecrypt } from 'crypto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginInDto } from './dto/log-in.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { LoggingService } from 'src/logging/logging.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly JwtService: JwtService,
        private readonly loggingService: LoggingService,

    ){}
    //  Use dtos
    async validateUser(loginDto: LoginInDto): Promise<UserResponseDto> {
        const {email, password} = loginDto
        const user = await this.userService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {  //clean code
            this.loggingService.log(`User ${email} successfully validated`, 'AuthService');
            const { password, ...userData } = user;
            return userData as UserResponseDto
        }
        this.loggingService.warn(`Invalid login attempt for ${email}`, 'AuthService');
        throw new UnauthorizedException('Invalid credentials');
    }

    // Never use any, use object
    async login(user:UserResponseDto) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = await this.JwtService.signAsync(payload);

        this.loggingService.log(`User ${user.email} logged in successfully`, 'AuthService');
        return {
            access_token: token,
        }
    }
}
