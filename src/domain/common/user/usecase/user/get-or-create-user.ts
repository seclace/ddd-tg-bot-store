import { User, UserName, UserTgId } from '../../domain/user/user';

export interface GetOrCreateUser {
  execute(tgId: UserTgId, username: UserName): Promise<User>;
}
