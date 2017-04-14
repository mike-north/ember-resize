import ResizeService from 'ember-resize/services/resize';
import configuration from 'ember-resize/configuration';
import ENV from '../config/environment';

export function initialize() {
  let application = arguments[1] || arguments[0];

  configuration.load(ENV['resizeServiceDefaults'] || {});

  application.register('service:resize', ResizeService);

  configuration.injectionFactories.forEach(factory => {
    application.inject(factory, 'resizeService', 'service:resize');
  });
}

export default {
  name: 'resize',
  initialize: initialize
};
