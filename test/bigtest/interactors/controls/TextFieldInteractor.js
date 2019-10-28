import {
  fillable,
  value,
  interactor,
} from '@bigtest/interactor';

export default interactor(class TextFieldInteractor {
  fill = fillable();
  value = value();

  fillAndBlur(val) {
    return this
      .focus()
      .fill(val)
      .blur();
  }
});
