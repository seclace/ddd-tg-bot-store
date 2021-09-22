import { UserExtractor } from '../../usecase/user/user-extractor';
import { UserPersister } from '../../usecase/user/user-persister';
import { User, UserTgId } from '../../domain/user/user';
import { EventPublisher } from '../../../types/domain-event';
import { knex } from '../../../../../db/knex';
import { T_USERS } from '../../../../../db/constants';

const columns = [
  'id',
  'tgId',
  'username',
];

export class PsqlUserRepository implements UserExtractor, UserPersister {
  constructor(
    private readonly eventPublisher: EventPublisher,
  ) {
  }

  async getOneByTgId(tgId: UserTgId): Promise<User | undefined> {
    const entry = await knex(T_USERS).select(columns).where('tgId', tgId).first();
    return entry ? User.from(entry.id, entry.tgId, entry.username) : undefined;
  }

  async save(user: User): Promise<User> {
    console.log({ user })
    if (user.id === -1) {
      const [id] = await knex(T_USERS).insert({
        tgId: user.tgId,
        username: user.username,
      }).returning('id');

      user.setIdAfterCreate(id);
    } else {
      await knex(T_USERS).update({
        tgId: user.tgId,
        username: user.username,
      }).where('id', user.id);
    }
    const events = user.popEvents();
    await this.eventPublisher.publish(events);

    return user;
  }
}
