import { quote } from '../../quote';
import { CQLBuilder } from '../CQLBuilder';
import { CQLBuilderValue } from '../CQLBuilderValue';

export class CQLBuilderArrayValue extends CQLBuilderValue {
  constructor(values) {
    super();
    this.values = values;
  }

  toCQL() {
    const formattedValue = this.values.map(this._formatValue.bind(this)).join(` ${CQLBuilder.OPERATORS.OR} `);

    return `(${formattedValue})`;
  }

  toString() {
    return this.toCQL();
  }

  _formatValue(value) {
    return quote(value);
  }
}
