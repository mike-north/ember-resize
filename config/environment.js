'use strict';

module.exports = function(/* environment, appConfig */) {
  return {
    resizeServiceDefaults: {
      widthSensitive: true,
      heightSensitive: false,
      debounceTimeout: 200,
      injectionFactories: ['view', 'component']
    }
  };
};
