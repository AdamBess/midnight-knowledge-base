import { Body, Controller, Post } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';


@Controller('chatbot')
export class ChatbotController {
    constructor(
        private chatbotService: ChatbotService
    ) {}

    @Post('chat')
    chat(@Body('question') question: string, @Body('threadId') threadId: string) {
        return this.chatbotService.chat(question, threadId);
    }
    
    @Post('ingest')
    ingest() {
        return this.chatbotService.ingest();
    }
}
