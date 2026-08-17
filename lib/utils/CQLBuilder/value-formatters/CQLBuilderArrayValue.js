import { quote } from '../../quote';
import { CQL_BUILDER_OPERATORS } from '../constants';
import { CQLBuilderValue } from '../CQLBuilderValue';

export class CQLBuilderArrayValue extends CQLBuilderValue {
  constructor(input, options = {}) {
    super(input, options);
  }

  toCQL() {
    const formattedValue = this.input.map(this._formatValue.bind(this)).join(` ${CQL_BUILDER_OPERATORS.OR} `);

    return this.input.length > 1 ? `(${formattedValue})` : formattedValue;
  }

  _formatValue(value) {
    return quote(this._getEscapedValue(value, { escapeCQL: this.escapeCQL }));
  }
}
