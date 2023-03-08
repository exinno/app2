import { Context, Dict } from '../..';
import { MessagingChannel } from '../..';
import { User } from '../views/principals';

export const userKeyFields = ['key', 'username', 'email', 'phoneNumber', 'token'] as const;
export type UserKeyField = typeof userKeyFields[number];

export interface AuthService {
  init(): void;

  signIn(username?: string, password?: string, context?: Context): Promise<User>;

  signOut(context?: Context): Promise<void>;

  signUp(user: Dict, context?: Context): Promise<User>;

  isExistingUser(value: string, field: UserKeyField): Promise<boolean>;

  updateUser(userData: User, context?: Context): Promise<void>;

  updateUserStatus?(status: string, user?: User): void;

  updatePassword(newPassword: string, currentPassword?: string, context?: Context): Promise<void>;

  resetPassword(newPassword: string, passwordToken?: string, context?: Context): Promise<void | string>;

  getUser(value: string, field: UserKeyField): Promise<User>;

  isAdmin(context?: Context): boolean;

  sendVerificationCode(to: string | number, channel: MessagingChannel): Promise<string>;

  getVerificationCode(): Promise<void>;

  sendResetPasswordLink(to: string): Promise<void>;

  sendVerificationLink(to: string, reSend?: boolean, accountToken?: string): Promise<void>;

  sendInvitation(to: string, inviter: string, spaceMembers?: Dict): Promise<void>;

  checkInvitation?(invitationToken: string): Promise<Dict>;

  user?: User;

  bookmarks?: Dict[];

  isBookmarked?(): boolean;
}
