import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { RegisterInput } from './dto/register.input';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(input: RegisterInput) {
    const exists = await this.userRepo.findOne({ where: { email: input.email } });
    if (exists) throw new ConflictException('Email déjà utilisé');

    const hashed = await bcrypt.hash(input.password, 12);
    const user = this.userRepo.create({ ...input, password: hashed });
    await this.userRepo.save(user);

    const token = this.jwtService.sign({ sub: user.id, role: user.role });
    return { token, user };
  }

  async login(input: LoginInput) {
    const user = await this.userRepo.findOne({ where: { email: input.email } });
    if (!user) throw new UnauthorizedException('Identifiants invalides');

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new UnauthorizedException('Identifiants invalides');

    const token = this.jwtService.sign({ sub: user.id, role: user.role });
    return { token, user };
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id: userId } });
  }
}