/**
 * SubmittingFeature - Manages form submitting state
 */

import { EVENTS } from '../../constants';
import { BaseFeature } from './BaseFeature';

export class SubmittingFeature extends BaseFeature {
  /**
   * Initialize submitting state
   */
  init() {
    super.init();
    this._setState('submitting', false);
    this._setState('submitSucceeded', false);
  }

  /**
   * Reset submitting state
   */
  reset() {
    super.reset();
    this._setState('submitting', false);
    this._setState('submitSucceeded', false);
  }

  /**
   * Check if form is submitting
   * @returns {boolean} True if form is submitting
   */
  isSubmitting() {
    return this._getState('submitting');
  }

  /**
   * Set submitting state
   * @param {boolean} submitting - Submitting state
   */
  setSubmitting(submitting) {
    const currentSubmitting = this._getState('submitting');

    if (currentSubmitting !== submitting) {
      this._setState('submitting', submitting);
      // Clear cache when submitting state changes to ensure fresh state
      this.engine.cacheService.clearFormStateCache();
      this.engine.eventService.emit(EVENTS.SUBMITTING, { submitting });
    }
  }

  /**
   * Start submitting
   */
  start() {
    this.setSubmitting(true);
  }

  /**
   * Stop submitting
   */
  stop() {
    this.setSubmitting(false);
  }

  /**
   * Set submit succeeded state
   * @param {boolean} succeeded - Whether submit succeeded
   */
  setSubmitSucceeded(succeeded) {
    const currentSubmitSucceeded = this._getState('submitSucceeded');

    if (currentSubmitSucceeded !== succeeded) {
      this._setState('submitSucceeded', succeeded);
      // Clear cache when submit succeeded state changes
      this.engine.cacheService.clearFormStateCache();
      // Emit submit event so subscribers (useFormState) get updated submitSucceeded state
      if (this.engine && this.engine.eventService) {
        const submitting = this._getState('submitting');

        this.engine.eventService.emit(EVENTS.SUBMIT, { submitting, success: succeeded });
      }
    }
  }

  /**
   * Check if form submit succeeded
   * @returns {boolean} True if form submit succeeded
   */
  hasSubmitSucceeded() {
    return this._getState('submitSucceeded');
  }
}
