export type InputCommand = |
  'empty' |
  'purchase' |
  'makeorder' |
  'payorder' |
  'getbasket';

export class InputToCommand {
  constructor(private input?: string) {}

  getCommand(): InputCommand {
    if (!this.input) {
      return 'empty';
    }
    if (/\/purchase/.test(this.input)) {
      return 'purchase';
    }
    if (this.input === '/basket') {
      return 'getbasket';
    }
    if (/\/makeorder/.test(this.input)) {
      return 'makeorder';
    }
    if (/\/payorder/.test(this.input)) {
      return 'payorder';
    }
    return 'empty';
  }
}
