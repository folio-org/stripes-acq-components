/* Developed collaboratively using AI (Cursor) */

import { FeatureFactory } from '../FeatureFactory';
import { ValuesFeature } from '../../features/ValuesFeature';
import { ErrorsFeature } from '../../features/ErrorsFeature';

describe('FeatureFactory', () => {
  let engine;

  beforeEach(() => {
    engine = {
      eventService: { emit: jest.fn() },
      validationService: {},
      cacheService: {},
    };
  });

  describe('createFeatures', () => {
    it('should create all features', () => {
      const features = FeatureFactory.createFeatures(engine);

      expect(features.valuesFeature).toBeInstanceOf(ValuesFeature);
      expect(features.errorsFeature).toBeInstanceOf(ErrorsFeature);
      expect(features.touchedFeature).toBeDefined();
      expect(features.activeFeature).toBeDefined();
      expect(features.submittingFeature).toBeDefined();
      expect(features.dirtyFeature).toBeDefined();
    });

    it('should pass engine to each feature', () => {
      const features = FeatureFactory.createFeatures(engine);

      expect(features.valuesFeature.engine).toBe(engine);
      expect(features.errorsFeature.engine).toBe(engine);
    });

    it('should use provided service override', () => {
      const customValuesFeature = new ValuesFeature(engine);
      const services = { valuesFeature: customValuesFeature };

      const features = FeatureFactory.createFeatures(engine, services);

      expect(features.valuesFeature).toBe(customValuesFeature);
    });

    it('should create default features for non-overridden services', () => {
      const customValuesFeature = new ValuesFeature(engine);
      const services = { valuesFeature: customValuesFeature };

      const features = FeatureFactory.createFeatures(engine, services);

      expect(features.valuesFeature).toBe(customValuesFeature);
      expect(features.errorsFeature).toBeInstanceOf(ErrorsFeature);
    });
  });

  describe('initializeFeatures', () => {
    it('should call init on all features', () => {
      const features = {
        feature1: { init: jest.fn() },
        feature2: { init: jest.fn() },
        feature3: { init: jest.fn() },
      };

      FeatureFactory.initializeFeatures(features, 'arg1', 'arg2');

      expect(features.feature1.init).toHaveBeenCalledWith('arg1', 'arg2');
      expect(features.feature2.init).toHaveBeenCalledWith('arg1', 'arg2');
      expect(features.feature3.init).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should skip features without init method', () => {
      const features = {
        feature1: { init: jest.fn() },
        feature2: {},
        feature3: null,
      };

      expect(() => {
        FeatureFactory.initializeFeatures(features);
      }).not.toThrow();

      expect(features.feature1.init).toHaveBeenCalled();
    });
  });

  describe('resetFeatures', () => {
    it('should call reset on all features', () => {
      const features = {
        feature1: { reset: jest.fn() },
        feature2: { reset: jest.fn() },
        feature3: { reset: jest.fn() },
      };

      FeatureFactory.resetFeatures(features);

      expect(features.feature1.reset).toHaveBeenCalled();
      expect(features.feature2.reset).toHaveBeenCalled();
      expect(features.feature3.reset).toHaveBeenCalled();
    });

    it('should skip features without reset method', () => {
      const features = {
        feature1: { reset: jest.fn() },
        feature2: {},
        feature3: null,
      };

      expect(() => {
        FeatureFactory.resetFeatures(features);
      }).not.toThrow();

      expect(features.feature1.reset).toHaveBeenCalled();
    });
  });
});
