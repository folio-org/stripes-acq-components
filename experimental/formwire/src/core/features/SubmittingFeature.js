/**
 * SubmittingFeature - Manages form submitting state
 */

import { EVENTS } from '../../constants';

export class SubmittingFeature {
  constructor(engine) {
    this.engine = engine;
    this.submitting = false;
    this.submitSucceeded = false;
  }

  /**
   * Initialize submitting state
   */
  init() {
    this.submitting = false;
    this.submitSucceeded = false;
  }

  /**
   * Reset submitting state
   */
  reset() {
    this.submitting = false;
    this.submitSucceeded = false;
  }

  /**
   * Check if form is submitting
   * @returns {boolean} True if form is submitting
   */
  isSubmitting() {
    return this.submitting;
  }

  /**
   * Set submitting state
   * @param {boolean} submitting - Submitting state
   */
  setSubmitting(submitting) {
    if (this.submitting !== submitting) {
      this.submitting = submitting;
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
    if (this.submitSucceeded !== succeeded) {
      this.submitSucceeded = succeeded;
      // Clear cache when submit succeeded state changes
      this.engine.cacheService.clearFormStateCache();
    }
  }

  /**
   * Check if form submit succeeded
   * @returns {boolean} True if form submit succeeded
   */
  hasSubmitSucceeded() {
    return this.submitSucceeded;
  }
}

