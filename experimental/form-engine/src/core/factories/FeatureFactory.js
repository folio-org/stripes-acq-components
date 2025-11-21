/**
 * FeatureFactory - Factory for creating form features
 * Follows Factory Pattern and simplifies initialization (KISS)
 */

import { ActiveFeature } from '../features/ActiveFeature';
import { DirtyFeature } from '../features/DirtyFeature';
import { ErrorsFeature } from '../features/ErrorsFeature';
import { SubmittingFeature } from '../features/SubmittingFeature';
import { TouchedFeature } from '../features/TouchedFeature';
import { ValuesFeature } from '../features/ValuesFeature';

export class FeatureFactory {
  /**
   * Create all features for a form engine
   * @param {Object} engine - Form engine instance
   * @param {Object} services - Optional service overrides
   * @returns {Object} Object with all features
   */
  static createFeatures(engine, services = {}) {
    const featureDefinitions = [
      ['valuesFeature', ValuesFeature],
      ['errorsFeature', ErrorsFeature],
      ['touchedFeature', TouchedFeature],
      ['activeFeature', ActiveFeature],
      ['submittingFeature', SubmittingFeature],
      ['dirtyFeature', DirtyFeature],
    ];

    return featureDefinitions.reduce((acc, [name, FeatureClass]) => {
      // Use provided service or create new instance
      acc[name] = services[name] || new FeatureClass(engine);

      return acc;
    }, {});
  }

  /**
   * Initialize all features
   * @param {Object} features - Features object
   * @param {*} args - Arguments to pass to init()
   */
  static initializeFeatures(features, ...args) {
    for (const feature of Object.values(features)) {
      if (feature && typeof feature.init === 'function') {
        feature.init(...args);
      }
    }
  }

  /**
   * Reset all features
   * @param {Object} features - Features object
   */
  static resetFeatures(features) {
    for (const feature of Object.values(features)) {
      if (feature && typeof feature.reset === 'function') {
        feature.reset();
      }
    }
  }
}
