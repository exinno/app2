import { ChatIntentModel } from 'index';

// chatbotService
/*
  lastIntent?: string;
  nextIntent?: string;
  nextContextField?: string;

  addContext(context: Dict) {
    for (const [key, value] of Object.entries(context)) {
      this.storage[key] = value?.trim();
    }
    localStorage.setItem('chatbotContext', JSON.stringify(this.storage));
  }

  async executeIntent(message: string) {
    if (this.nextIntent) {
      this.executeIntentByName(this.nextIntent, message);
      return true;
    }

    const intents: ChatIntentModel[] = modelService
      .getAll('chatIntents')
      .filter((intent) => !intent.name.startsWith('$') && !intent.disabled);

    for (const intent of intents) {
      for (const pattern of intent.patterns) {
        const matched: any = pattern.exec(message);
        if (matched) {
          if (matched.groups) this.addContext(matched.groups);

          await this.executeIntentInternal(intent, this.context);
          return true;
        }
      }
    }
    return false;
  }
  private executeIntentByName(intentName: string, message?: string) {
    const intent: ChatIntentModel = modelService.get(intentName, 'chatIntents');
    if (message)
      for (const pattern of intent.patterns) {
        const matched: any = pattern.exec(message);
        if (matched?.groups) {
          this.addContext(matched.groups);
        }
      }
    this.executeIntentInternal(intent, this.context);
  }

  private async executeIntentInternal(intent: ChatIntentModel, data: any) {
    let result;
    try {
      result = await modelService.callProp(intent, 'execute', { data });
    } catch (e: any) {
      result = e?.message ?? e;
    }

    let message;
    if (typeof result == 'boolean') {
      message = result ? intent.successResponse : intent.failResponse;
    } else if (typeof result == 'string') {
      message = result;
    } else {
      message = intent.successResponse;
    }
    if (message) this.respond({ message: formatString(message, data) });
    this.lastIntent = intent.name;
  }

  receiveNextContext(contextField: string, message: string) {
    this.nextContextField = contextField;
    this.nextIntent = '$receiveNextContext';
    return message;
  }

  saveNextContext(context: Dict) {
    if (!this.nextContextField || !context.value) {
      throw new Error();
    }
    this.addContext({ [this.nextContextField]: context.value });
    delete this.context.value;
    this.nextContextField = undefined;
    this.nextIntent = undefined;
    if (this.lastIntent) this.executeIntentByName(this.lastIntent);
  }
*/

const chatIntents: ChatIntentModel[] = [
  {
    name: 'showContext',
    patterns: [/showContext/],
    execute: ({ registry: { chatbotService } }) => {
      return JSON.stringify(chatbotService.context);
    }
  },
  {
    name: '$receiveNextContext',
    patterns: [/(?<value>.*)(입니다|이다|임|요|\.)/, /(?<value>.*)/],
    execute: ({ registry: { chatbotService }, data }) => {
      chatbotService.saveNextContext(data);
    }
  },
  {
    name: 'hi',
    disabled: true,
    patterns: [/.*안녕.*/],
    successResponse: '{yourName}님 안녕하세요?',
    execute: ({ registry: { chatbotService }, data }) => {
      if (data.yourName) {
        return `${data.yourName}님 안녕하세요?`;
      } else {
        return chatbotService.receiveNextContext('yourName', '안녕하세요? 처음 뵙겠습니다. 성함이 어떻게되세요?');
      }
    }
  },
  {
    name: 'iAm',
    disabled: true,
    patterns: [/.*(나는|내.*이름은)(?<yourName>.*)(라고|야|입니다|이다|).*/],
    successResponse: '당신 이름은 {yourName}이군요. 기억하겠습니다'
  },
  {
    name: 'whoAreU',
    disabled: true,
    patterns: [/.*너.*누구.*/],
    successResponse: '저는 오컴봇이라고 해요'
  },
  {
    name: 'whoAmI',
    disabled: true,
    patterns: [/.*(내 이름|나의 이름|나 누구).*(뭐|알고|아니|\?).*/],
    successResponse: '당신 이름은 {yourName}입니다',
    failResponse: '아직 당신 이름을 몰라요. 알려주세요',
    execute: ({ registry: { chatbotService } }) => {
      return !!chatbotService.context.yourName;
    }
  },
  {
    name: 'openMenu',
    patterns: [/메뉴.*닫.*/, /메뉴.*클로.*/],
    successResponse: '메뉴를 닫았습니다',
    execute: ({ registry: { uiService } }) => {
      uiService.menuOpened = false;
      return true;
    }
  },
  {
    name: 'closeMenu',
    patterns: [/메뉴.*열.*/, /메뉴.*오픈.*/],
    successResponse: '메뉴를 열었습니다',
    execute: ({ registry: { uiService } }) => {
      uiService.menuOpened = true;
      return true;
    }
  },
  {
    name: 'openView',
    patterns: [/(?<viewName>.*).*화면.*열.*/],
    successResponse: '{viewName} 화면를 열었습니다.',
    failResponse: '{viewName} 화면은 없습니다',
    execute: ({ registry: { modelService, uiService, chatbotService }, data }) => {
      if (!data.viewName) {
        return chatbotService.receiveNextContext('viewName', '어떤 화면을 열까요?');
      }

      const view = modelService.model.views.find((view) => view.label == data.viewName || view.name == data.viewName);
      if (view) {
        void uiService.openRoute({ view: view?.name });
        return true;
      } else {
        return false;
      }
    }
  },
  {
    name: 'search',
    patterns: [/(?<searchQuery>.*).*검색.*/],
    successResponse: '구글에서 {searchQuery} 검색했습니다',
    execute: ({ data }) => {
      window.open('https://www.google.com/search?q=' + data.searchQuery);
      return true;
    }
  },
  {
    name: 'fullscreen',
    patterns: [/.*전체화면.*/, /.*풀스크린.*/],
    successResponse: '전체화면으로 전환했습니다',
    failResponse: '전체화면을 해제했습니다',
    execute: ({ registry: { modelService } }) => {
      return modelService.executeWebAction('fullscreen');
    }
  }
];

export default chatIntents;
