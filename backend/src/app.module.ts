import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { TypeOrmModule } from '@nestjs/typeorm'
import { ChatbotService } from './chatbot/chatbot.service';
import { ChatbotController } from './chatbot/chatbot.controller';
import { ConfigModule } from '@nestjs/config' 

@Module({
  imports: [
    HealthModule,
    ConfigModule.forRoot({ envFilePath: '../.env' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'postgres',
      entities: [],
      synchronize: true
    })
  ],
  controllers: [AppController, ChatbotController],
  providers: [AppService, ChatbotService],
})
export class AppModule {}
