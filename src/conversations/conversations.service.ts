import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { Conversation, ConversationDocument } from './entities/schema';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectModel(Conversation.name)
    private readonly conversationModel: Model<ConversationDocument>,
  ) {}

  async create(createConversationDto: CreateConversationDto) {
    const createdConversation = new this.conversationModel(createConversationDto);
    return createdConversation.save();
  }

  async findAll() {
    return this.conversationModel.find().exec();
  }

  async findOne(id: number) {
    const conversation = await this.conversationModel.findOne({ id }).exec();
    if (!conversation) {
      throw new NotFoundException(`Conversation with id ${id} not found`);
    }
    return conversation;
  }

  async update(id: number, updateConversationDto: UpdateConversationDto) {
    const conversation = await this.conversationModel
      .findOneAndUpdate({ id }, updateConversationDto, { new: true })
      .exec();
    if (!conversation) {
      throw new NotFoundException(`Conversation with id ${id} not found`);
    }
    return conversation;
  }

  async remove(id: number) {
    const conversation = await this.conversationModel.findOneAndDelete({ id }).exec();
    if (!conversation) {
      throw new NotFoundException(`Conversation with id ${id} not found`);
    }
    return conversation;
  }
}
