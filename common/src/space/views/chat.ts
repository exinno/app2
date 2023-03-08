import {
  ChatMessage,
  ChatViewModel,
  Field,
  View,
  Recordable,
  asArray,
  ListSectionModel,
  Group,
  GroupMember
} from '../..';

export const chatRoom: ChatViewModel = {
  type: 'ChatView',
  label: ({ pageCtx }) => pageCtx?.chatRoom?.name ?? 'Chat',
  getMessages({ dataId, registry: { dataService }, value }) {
    return dataService.find<ChatMessage>({
      view: 'chatMessages',
      filter: { to: dataId },
      orderBy: [{ field: 'sentDate', direction: 'desc' }],
      skip: value.skip,
      top: value.top,
      live: true,
      livePrepend: true
    });
  },
  getGroupMembers({ dataId, registry: { dataService } }) {
    return dataService.find<GroupMember>({
      view: 'groupMembers',
      select: ['member', 'member.picture', 'member.status'],
      filter: {
        filters: [
          { field: 'group', value: dataId },
          { field: 'member.id', operator: 'notNull' }
        ]
      },
      live: true
    });
  },
  async onDataIdChange({ dataId, pageCtx, registry: { dataService } }) {
    pageCtx.chatRoom = await dataService.get({ view: 'chatRooms', dataId });
  },
  send: async ({ dataId, value, pageCtx, registry: { dataService } }) => {
    const message: SpaceChatMessage = { ...value, to: dataId, chatRoom: dataId, space: pageCtx.chatRoom.space };
    await dataService.create<SpaceChatMessage>({ view: 'chatMessages', data: message });
  },
  inputActions: ['uploadFile', 'sendFiles', 'sendTasks'],
  viewActions: ['toggleVideoCall', 'toggleChat', 'toggleMic', 'toggleCamera', 'toggleScreenShare', 'openChatDetail'],
  hideActionLabel: true,
  webActions: [
    {
      name: 'toggleVideoCall',
      icon: 'mdi-video-account',
      selected: ({ viewService }) => viewService.showVideoCall,
      execute: ({ viewService }) => viewService.toggleVideoCall(),
      disabled: ({ viewService }) => !viewService.showChat,
      hidden: () => typeof navigator?.mediaDevices?.getUserMedia != 'function'
    },
    {
      name: 'toggleChat',
      icon: 'mdi-chat',
      selected: ({ viewService }) => viewService.showChat,
      execute: ({ viewService }) => viewService.toggleChat(),
      disabled: ({ viewService }) => !viewService.showVideoCall
    },
    {
      name: 'toggleMic',
      icon: ({ viewService }) => (viewService.videoCall?.isMicOn ? 'mdi-microphone' : 'mdi-microphone-off'),
      selected: ({ viewService }) => viewService.videoCall?.isMicOn,
      execute: ({ viewService }) => viewService.videoCall?.toggleMic(),
      disabled: ({ viewService }) => !viewService.showVideoCall
    },
    {
      name: 'toggleCamera',
      icon: ({ viewService }) => (viewService.videoCall?.isCameraOn ? 'mdi-camera' : 'mdi-camera-off'),
      selected: ({ viewService }) => viewService.videoCall?.isCameraOn,
      execute: ({ viewService }) => viewService.videoCall?.toggleCamera(),
      disabled: ({ viewService }) => !viewService.showVideoCall
    },
    {
      name: 'toggleScreenShare',
      icon: 'mdi-monitor-share',
      selected: ({ viewService }) => viewService.videoCall?.screenShare,
      execute: ({ viewService }) => viewService.videoCall?.toggleScreenShare(),
      disabled: ({ viewService }) => !viewService.showVideoCall,
      hidden: () => typeof navigator?.mediaDevices?.getDisplayMedia != 'function'
    },
    {
      name: 'openChatDetail',
      label: 'Chat Members',
      icon: 'mdi-account-multiple',
      execute: async ({ viewService, registry: { uiService } }) => {
        await uiService.openPanel({
          view: {
            type: 'ListView',
            keyField: 'id',
            parent: 'users',
            label: 'Members',
            noServer: true,
            listSections: [
              { listFields: ['picture'], side: true, avatar: true },
              { listFields: ['displayName'] },
              { listFields: ['status'], side: true }
            ],
            data: () => viewService.members
          },
          openType: 'panel',
          overlay: true,
          width: 300,
          parentView: viewService
        });
      }
    },
    {
      name: 'uploadFile',
      label: 'Upload',
      icon: 'mdi-upload-outline',
      execute: async ({ pageCtx, registry: { storageClient }, viewService }) => {
        const dataIds = await storageClient.openUpload(pageCtx.chatRoom.space, viewService);
        if (dataIds) {
          if (dataIds.some((dataId) => dataId == null)) throw new Error('some dataId is null');
          viewService.send({ dataView: 'fileList', dataIds });
        }
      }
    },
    {
      name: 'sendFiles',
      label: 'Drive',
      icon: 'mdi-cloud',
      execute: async ({ registry: { uiService }, viewService }) => {
        const pageCtx: any = { spaceId: 'everything' };
        const data = await uiService.openModal({
          view: { parent: 'files', viewActions: ['openParent', '--', 'submitSelected'] },
          pageCtx,
          openSize: 'full',
          parentView: viewService
        });
        if (data) viewService.send({ dataView: 'fileList', dataIds: data.map((row) => row.id) });
      }
    },
    {
      name: 'sendTasks',
      label: 'Task',
      icon: 'mdi-format-list-checkbox',
      execute: async ({ registry: { uiService }, viewService }) => {
        const pageCtx: any = { spaceId: 'everything' };
        const data = await uiService.openModal({
          view: { parent: 'tasks', viewActions: ['--', 'submitSelected'] },
          pageCtx,
          openSize: 'full',
          parentView: viewService
        });
        if (data) viewService.send({ dataView: 'taskList', dataIds: data.map((row) => row.id) });
      }
    }
  ]
};

@View({
  name: 'chatRooms',
  type: 'ListView',
  parent: 'recordable',
  table: 'space_chat_room',
  labelField: 'name',
  acl: 'groupRead',
  aclByRecord: true,
  groupField: 'group',
  ownerField: 'space.owner',
  label: 'Chat',
  subLabel: ({ pageCtx }) => pageCtx.space?.name,
  icon: 'mdi-chat',
  newView: {
    type: 'FormView',
    label: 'Chat Room'
  },
  detailView: 'chatRoom',
  listSections: ({ pageCtx }) => {
    const sections: ListSectionModel[] = [
      {
        side: true,
        avatar: true,
        listFields: ['space.picture']
      },
      { listFields: ['name'] }
    ];
    if (pageCtx.spaceId == 'everything') sections.push({ listFields: ['space.name'], side: true });
    return sections;
  },
  itemClickAction: 'openEdit',
  viewActions: ['openAdd'],
  hideActionLabel: true,
  defaultData: ({ pageCtx }) => ({ space: pageCtx?.spaceId }),
  filter: ({ pageCtx }) => ({ space: pageCtx.spaceId == 'everything' ? undefined : pageCtx.spaceId }),
  beforeCreate: async ({ data, registry: { dataService, authService } }) => {
    for (const room of asArray(data)) {
      if (data.group) return;

      const group: Group = { displayName: room.name, groupType: 'chatRoom' };
      await dataService.create<Group>({ view: 'groups', data: group });
      room.id = group.id;
      room.group = group.id;

      const members: string[] = room.members ?? [];
      members.push(authService.user.id);
      await dataService.create<GroupMember[]>({
        view: 'groupMembers',
        data: members.map((member) => ({ member, group: group.id }))
      });
    }
  },
  beforeRemove: async ({ filter, dataId, registry: { dataService } }) => {
    if (!dataId && filter) {
      const chatRooms = await dataService.getAll({ view: 'chatRooms', filter, select: ['id'] });
      dataId = chatRooms.map((chatRoom) => chatRoom.id);
    }
    for (const roomId of asArray(dataId)) {
      await dataService.remove({ view: 'chatMessages', filter: { chatRoom: roomId }, skipNoRecord: true });
      await dataService.remove({
        view: 'groups',
        dataId: roomId,
        filter: { groupType: 'chatRoom' },
        skipNoRecord: true
      });
    }
  }
})
export class ChatRoom extends Recordable {
  @Field({ type: 'StringField', required: true, cols: 12 })
  name: string;

  @Field({ type: 'LookupField', relatedView: 'spaces', required: true, hidden: true })
  space: any;

  @Field({ type: 'LookupField', relatedView: 'groups', hidden: true })
  group: any;

  @Field({
    type: 'SelectField',
    temporary: true,
    keyField: 'id',
    labelField: 'displayName',
    multiple: true,
    optionItems: ({ pageCtx, registry: { authService } }) =>
      pageCtx.members.filter((member) => member.id != authService.user.id),
    cols: 12
  })
  members?: any;
}

@View({
  type: 'DataGridView',
  name: 'chatMessages',
  parent: 'recordable',
  table: 'space_chat_message',
  acl: 'authRead',
  beforeCreate: async ({ data, context }) => {
    for (const row of asArray<SpaceChatMessage>(data)) {
      row.from = context.user.id;
      row.sentDate = new Date();
    }
  }
})
export class SpaceChatMessage extends Recordable implements Partial<ChatMessage> {
  @Field({ type: 'StringField', required: true })
  from?: string;

  @Field({ type: 'LookupField', relatedView: 'principals', required: true })
  to: string;

  @Field({ type: 'StringField', required: true })
  message: string;

  @Field({ type: 'StringField' })
  dataView?: string;

  @Field({ type: 'JsonField' })
  dataIds?: string[];

  @Field({ type: 'DateField', required: true })
  sentDate?: Date;

  @Field({ type: 'LookupField', relatedView: 'chatRooms', required: true })
  chatRoom?: string;

  @Field({ type: 'LookupField', relatedView: 'spaces', required: true })
  space?: string;
}
