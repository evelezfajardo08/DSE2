import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './entities/schema';
import { Progress, ProgressSchema } from '../progress/entities/schema';
import { Result, ResultSchema } from '../results/entities/schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Progress.name, schema: ProgressSchema },
      { name: Result.name, schema: ResultSchema },
    ]),
    JwtModule.register({ secret: 'SECRET_KEY_LIDERABOT_123' }),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtAuthGuard],
  exports: [UsersService],
})
export class UsersModule {}
