import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentsService } from './contents.service';
import { ContentsController } from './contents.controller';
import { Content, ContentSchema } from './entities/schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Content.name, schema: ContentSchema }]),
  ],
  controllers: [ContentsController],
  providers: [ContentsService],
})
export class ContentsModule {}
