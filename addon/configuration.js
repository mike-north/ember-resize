
import Ember from 'ember';

const { getWithDefault, typeOf } = Ember;

const DEFAULTS = {
  widthSensitive: true,
  heightSensitive: true,
  debounceTimeout: 200,
  injectionFactories: ['view', 'component']
};

export default {
  widthSensitive: DEFAULTS.widthSensitive,
  heightSensitive: DEFAULTS.heightSensitive,
  debounceTimeout: DEFAULTS.debounceTimeout,
  injectionFactories: DEFAULTS.injectionFactories,

  load(config) {
    for (let property in this) {
      if (this.hasOwnProperty(property) && typeOf(this[property]) !== 'function') {
        this[property] = getWithDefault(config, property, DEFAULTS[property]);
      }
    }
  }
};
