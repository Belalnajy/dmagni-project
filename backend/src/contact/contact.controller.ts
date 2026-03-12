import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactMessage } from '../entities/contact-message.entity';

@Controller('contact')
export class ContactController {
  constructor(
    @InjectRepository(ContactMessage)
    private readonly contactRepository: Repository<ContactMessage>,
  ) {}

  @Post()
  async createMessage(
    @Body() body: { name: string; email: string; message: string },
  ) {
    const newMessage = this.contactRepository.create(body);
    await this.contactRepository.save(newMessage);
    return { success: true, message: 'Message sent successfully.' };
  }

  @Get()
  async getMessages() {
    return this.contactRepository.find({ order: { createdAt: 'DESC' } });
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string) {
    await this.contactRepository.update(id, { isRead: true });
    return { success: true };
  }
}
