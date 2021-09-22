import { User, UserName, UserTgId } from '../../domain/user/user';
import { GetOrCreateUser } from './get-or-create-user';
import { UserExtractor } from './user-extractor';
import { UserPersister } from './user-persister';

export class GetOrCreateUserUseCase implements GetOrCreateUser {
  constructor(
    private readonly userExtractor: UserExtractor,
    private readonly userPersister: UserPersister,
  ) {}

  async execute(tgId: UserTgId, username: UserName): Promise<User> {
    const mayBeUser = await this.userExtractor.getOneByTgId(tgId);
    if (mayBeUser) {
      return mayBeUser;
    }

    const user = User.create(tgId, username);
    return this.userPersister.save(user);
  }
}
