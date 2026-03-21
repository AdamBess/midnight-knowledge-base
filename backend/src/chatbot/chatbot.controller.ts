import { Body, Controller, Get, Post } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
export class ChatbotController {
    constructor(
        private chatbotService: ChatbotService
    ) {}

    @Post('chat')
    chat(@Body('question') question: string) {
        return this.chatbotService.chat(question);
    }
    
    @Post('ingest')
    ingest() {
        return this.chatbotService.ingest();
    }
}
