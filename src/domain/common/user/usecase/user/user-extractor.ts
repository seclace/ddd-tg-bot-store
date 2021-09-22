import { User, UserTgId } from '../../domain/user/user';

export interface UserExtractor {
  getOneByTgId(tgId: UserTgId): Promise<User | undefined>;
}
