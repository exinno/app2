import { MessageModel } from 'index';

const list: Array<MessageModel> = [
  {
    name: 'hello',
    enText: 'Hello? ${name}',
    koText: '${name} 안녕하세요?',
    zhText: '${name} 你好？',
    jaText: '${name} こんにちは？',
    frText: 'Bonjour? ${name}'
  }
];

export default list;
