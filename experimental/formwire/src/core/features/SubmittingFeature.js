/**
 * SubmittingFeature - Manages form submitting state
 */

import { EVENTS } from '../../constants';

export class SubmittingFeature {
  constructor(engine) {
    this.engine = engine;
    this.submitting = false;
  }

  /**
   * Initialize submitting state
   */
  init() {
    this.submitting = false;
  }

  /**
   * Reset submitting state
   */
  reset() {
    this.submitting = false;
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
}

