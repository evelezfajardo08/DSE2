import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBotDto } from './dto/create-bot.dto';
import { UpdateBotDto } from './dto/update-bot.dto';
import { Bot, BotDocument } from './entities/schema';

@Injectable()
export class BotsService {
  constructor(
    @InjectModel(Bot.name)
    private readonly botModel: Model<BotDocument>,
  ) {}

  async create(createBotDto: CreateBotDto) {
    const createdBot = new this.botModel(createBotDto);
    return createdBot.save();
  }

  async findAll() {
    return this.botModel.find().exec();
  }

  async findOne(id: number) {
    const bot = await this.botModel.findOne({ id }).exec();
    if (!bot) {
      throw new NotFoundException(`Bot with id ${id} not found`);
    }
    return bot;
  }

  async update(id: number, updateBotDto: UpdateBotDto) {
    const bot = await this.botModel
      .findOneAndUpdate({ id }, updateBotDto, { new: true })
      .exec();
    if (!bot) {
      throw new NotFoundException(`Bot with id ${id} not found`);
    }
    return bot;
  }

  async remove(id: number) {
    const bot = await this.botModel.findOneAndDelete({ id }).exec();
    if (!bot) {
      throw new NotFoundException(`Bot with id ${id} not found`);
    }
    return bot;
  }
}
