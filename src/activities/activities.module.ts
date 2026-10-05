import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { ChatModule } from '../chat/chat.module';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { ActivityAttempt, ActivityAttemptSchema } from './entities/activity-attempt.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ActivityAttempt.name, schema: ActivityAttemptSchema }]),
    AuthModule,
    ChatModule,
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
})
export class ActivitiesModule {}