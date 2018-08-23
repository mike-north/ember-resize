import ResizeService from 'ember-resize/services/resize';
import config from '../config/environment';
import { getWithDefault } from '@ember/object';

export function initialize() {
  let application = arguments[1] || arguments[0];

  const resizeServiceDefaults = getWithDefault(config, 'resizeServiceDefaults', {
    widthSensitive: true,
    heightSensitive: true,
    debounceTimeout: 200
  });
  const injectionFactories = getWithDefault(resizeServiceDefaults, 'injectionFactories', ['view', 'component']) ;

  application.unregister('config:resize-service');
  application.unregister('service:resize');

  application.register('config:resize-service', resizeServiceDefaults, { instantiate: false });
  application.register('service:resize', ResizeService);
  application.inject('service:resize', 'resizeServiceDefaults', 'config:resize-service');

  injectionFactories.forEach(factory => {
    application.inject(factory, 'resizeService', 'service:resize');
  });
}

export default {
  name: 'resize',
  initialize: initialize
};
