/* eslint-disable max-classes-per-file */
import {
  attribute,
  clickable,
  collection,
  count,
  fillable,
  interactor,
  isPresent,
  text,
} from '@bigtest/interactor';

const OptionInteractor = interactor(class OptionInteractor {
  clickOption = clickable();
  label = text('li *:first-child');
  id = attribute('id');
});

export default interactor(class MultiSelectionInteractor {
  defaultScope = '[class*=multiSelectContainer---]';
  controlPresent = isPresent('[class*=multiSelectContainer---]');
  optionCount = count('[class*=multiSelectOptionList---] li');
  valueCount = count('[class*=valueChipRoot---]');
  clickControl = clickable('[class*=multiSelectControl---]');
  fillFilter = fillable('[class*=multiSelectInput---]');
  options = collection('[class*=multiSelectOption---]', OptionInteractor);
});
