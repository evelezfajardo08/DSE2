import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { Module as AppModule, ModuleSchema } from './entities/schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: AppModule.name, schema: ModuleSchema }]),
  ],
  controllers: [ModulesController],
  providers: [ModulesService],
})
export class ModulesModule {}
