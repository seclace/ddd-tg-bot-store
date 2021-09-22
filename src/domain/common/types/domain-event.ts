import { v4 } from 'uuid';

class EventId {
  private constructor(readonly value: string) {}

  static generate(): EventId {
    return new EventId(v4());
  }
}

export class DomainEvent {
  readonly id: EventId = EventId.generate();
}

export interface EventPublisher {
  publish(events: DomainEvent[]): Promise<void>;
}
