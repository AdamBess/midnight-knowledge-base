import { Controller, Get, Post } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
export class ChatbotController {
    constructor(
        private chatbotService: ChatbotService
    ) {}

    @Get('chat')
    chat() {
        return this.chatbotService.chat();
    }
    
    @Post('ingest')
    ingest() {
        return this.chatbotService.ingest();
    }
}
