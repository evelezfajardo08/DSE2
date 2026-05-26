import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message, MessageDocument } from './entities/schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name)
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const createdMessage = new this.messageModel(createMessageDto);
    return createdMessage.save();
  }

  async findAll() {
    return this.messageModel.find().exec();
  }

  async findOne(id: number) {
    const message = await this.messageModel.findOne({ id }).exec();
    if (!message) {
      throw new NotFoundException(`Message with id ${id} not found`);
    }
    return message;
  }

  async update(id: number, updateMessageDto: UpdateMessageDto) {
    const message = await this.messageModel
      .findOneAndUpdate({ id }, updateMessageDto, { new: true })
      .exec();
    if (!message) {
      throw new NotFoundException(`Message with id ${id} not found`);
    }
    return message;
  }

  async remove(id: number) {
    const message = await this.messageModel.findOneAndDelete({ id }).exec();
    if (!message) {
      throw new NotFoundException(`Message with id ${id} not found`);
    }
    return message;
  }
}
