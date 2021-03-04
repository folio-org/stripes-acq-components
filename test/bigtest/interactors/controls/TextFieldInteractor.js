import {
  fillable,
  value,
  interactor,
  focusable,
  blurrable,
} from '@bigtest/interactor';

export default interactor(class TextFieldInteractor {
  focus = focusable();
  blur= blurrable();
  fill = fillable();
  value = value();

  fillAndBlur(val) {
    return this
      .focus()
      .fill(val)
      .blur();
  }
});
