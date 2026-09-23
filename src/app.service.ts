import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  hello(): { message: string, docs: string} {
    return {
      message: 'hello 👋, welcome to the airline provider openAPI ✈️🚀.',
      docs: 'for the api documentation, go to /docs',
    };
  }
}




