import { DomainEvent } from './domain-event';

export class DomainEntity<T> {
  private events: DomainEvent[] = [];

  constructor(readonly id: T) {}

  protected addEvent(event: DomainEvent): void {
    this.events.push(event);
  }

  popEvents(): DomainEvent[] {
    const events = this.events;
    this.events = [];
    return events;
  }
}
