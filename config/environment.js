'use strict';

module.exports = function(/* environment, appConfig */) {
  return {
    resizeServiceDefaults: {
      widthSensitive: true,
      heightSensitive: true,
      debounceTimeout: 200,
      injectionFactories: ['view', 'component']
    }
  };
};
