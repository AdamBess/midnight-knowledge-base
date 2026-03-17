import { Injectable } from '@nestjs/common';
import { initChatModel } from 'langchain';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PGVectorStore } from '@langchain/community/vectorstores/pgvector';
import { PlaywrightWebBaseLoader } from '@langchain/community/document_loaders/web/playwright';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

@Injectable()
export class ChatbotService {
  async chat() {
    const model = await initChatModel('gpt-5-mini');

    const embeddings = new OpenAIEmbeddings({
      model: 'text-embedding-3-small',
    });

    const vectorStore = await PGVectorStore.initialize(embeddings, {
      postgresConnectionOptions: {
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'postgres',
      },
      tableName: 'midnight_guides',
    });

    const url = 'https://www.wowhead.com/guide/midnight/expansion-overview';
    const loader = new PlaywrightWebBaseLoader(url, {
      launchOptions: {
        headless: true,
      },
      gotoOptions: {
        waitUntil: 'networkidle',
      },
      async evaluate(page, browser, response) {
        await page.waitForSelector('#guide-body', { timeout: 10000 });

        const result = await page.evaluate(() => {
          const element = document.querySelector('#guide-body');
          return element ? element.textContent : '';
        });

        return result;
      },
    });

    const docs = await loader.load();
    docs[0].pageContent = docs[0].pageContent
      .replace(/Show Table of Contents/g, '')
      .replace(/Click to view more about.*?\n/g, '')
      .replace(/\s{2,}/g, ' ')
      .trim();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const allSplits = await splitter.splitDocuments(docs);

    await vectorStore.addDocuments(allSplits);
  }
}
