// eslint-disable-next-line no-unused-vars
import ApplicationInstance from '@ember/application/instance';
import { getWithDefault } from '@ember/object';
import ResizeService from 'ember-resize/services/resize';
import config from '../config/environment';

export function initialize(application: {
  register: ApplicationInstance['register'],
  unregister: ApplicationInstance['unregister'],
  inject: ApplicationInstance['inject'],
}) {
  const resizeServiceDefaults = getWithDefault(config, 'resizeServiceDefaults', {
    debounceTimeout: 200,
    heightSensitive: true,
    widthSensitive: true,
  });
  const injectionFactories = getWithDefault(resizeServiceDefaults, 'injectionFactories', ['view', 'component']) || [];

  application.unregister('config:resize-service');
  application.unregister('service:resize');

  application.register('config:resize-service', resizeServiceDefaults, { instantiate: false });
  application.register('service:resize', ResizeService);
  application.inject('service:resize', 'resizeServiceDefaults', 'config:resize-service');

  injectionFactories.forEach((factory) => {
    application.inject(factory, 'resizeService', 'service:resize');
  });
}

export default {
  initialize,
  name: 'resize',
};
