import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BotsService } from './bots.service';
import { BotsController } from './bots.controller';
import { Bot, BotSchema } from './entities/schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Bot.name, schema: BotSchema }]),
  ],
  controllers: [BotsController],
  providers: [BotsService],
})
export class BotsModule {}
