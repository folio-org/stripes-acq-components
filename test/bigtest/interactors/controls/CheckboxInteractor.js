import {
  attribute,
  blurrable,
  clickable,
  focusable,
  interactor,
  property,
  value,
} from '@bigtest/interactor';

export default interactor(class CheckboxInteractor {
  className = attribute('class');
  id = attribute('id');
  clickInput = clickable();
  blurInput = blurrable();
  focusInput = focusable();
  inputValue = value();
  isChecked = property('checked');
  isDisabled = property('disabled');

  clickAndBlur() {
    return this
      .clickInput()
      .blurInput();
  }
});
