import {
  collection,
  interactor,
  isPresent,
  text,
} from '@bigtest/interactor';

export default interactor(class CalloutInteractor {
  anyCalloutIsPresent = isPresent('[data-test-callout-element]');
  list = collection('[data-test-callout-element]', {
    message: text(),
  });
});
