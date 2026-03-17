import { Controller, Get } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';

@Controller('chatbot')
export class ChatbotController {
    constructor(
        private chatbotService: ChatbotService
    ) {}

    @Get()
    chatbot() {
        return this.chatbotService.chat();
    }
}
