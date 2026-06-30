import { quote } from '../../quote';
import { CQLBuilderValue } from '../CQLBuilderValue';

export class CQLBuilderStringValue extends CQLBuilderValue {
  constructor(input, options = {}) {
    super(input, options);
  }

  toCQL() {
    return this._formatValue(this.input);
  }

  _formatValue(value) {
    return quote(this._getEscapedValue(value, { escapeCQL: this.escapeCQL }));
  }
}
