import { User } from '../../domain/user/user';

export interface UserPersister {
  save(user: User): Promise<User>;
}
