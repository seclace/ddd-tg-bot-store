import { DomainEvent, EventPublisher } from '../../domain/common/types/domain-event';

export class BotEventPublisher implements EventPublisher {
  async publish(events: DomainEvent[]): Promise<void> {
    console.log(events);
  }
}
