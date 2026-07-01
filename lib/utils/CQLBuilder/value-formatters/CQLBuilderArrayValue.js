import { quote } from '../../quote';
import { CQLBuilder } from '../CQLBuilder';
import { CQLBuilderValue } from '../CQLBuilderValue';

export class CQLBuilderArrayValue extends CQLBuilderValue {
  constructor(input, options = {}) {
    super(input, options);
  }

  toCQL() {
    const formattedValue = this.input.map(this._formatValue.bind(this)).join(` ${CQLBuilder.OPERATORS.OR} `);

    return this.input.length > 1 ? `(${formattedValue})` : formattedValue;
  }

  _formatValue(value) {
    return quote(this._getEscapedValue(value, { escapeCQL: this.escapeCQL }));
  }
}
