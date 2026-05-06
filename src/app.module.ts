import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BotsModule } from './bots/bots.module';
import { UsersModule } from './users/users.module';
import { ConversationsModule } from './conversations/conversations.module';
import { ProgressModule } from './progress/progress.module';
import { MessagesModule } from './messages/messages.module';
import { ResultsModule } from './results/results.module';
import { ModulesModule } from './modules/modules.module';
import { ContentsModule } from './contents/contents.module';
import { AssessmentsModule } from './assessments/assessments.module';

@Module({
  imports: [BotsModule, UsersModule, ConversationsModule, ProgressModule, MessagesModule, ResultsModule, ModulesModule, ContentsModule, AssessmentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
