import { getWithDefault } from '@ember/object';
import ResizeService from 'ember-resize/services/resize';
import config from '../config/environment';
export function initialize(application) {
    const resizeServiceDefaults = getWithDefault(config, 'resizeServiceDefaults', {
        debounceTimeout: 200,
        heightSensitive: true,
        widthSensitive: true,
    });
    const injectionFactories = getWithDefault(resizeServiceDefaults, 'injectionFactories', ['view', 'component']) || [];
    application.unregister('config:resize-service');
    application.register('config:resize-service', resizeServiceDefaults, { instantiate: false });
    application.register('service:resize', ResizeService);
    const resizeService = application.resolveRegistration('service:resize');
    resizeService.prototype.resizeServiceDefaults = resizeServiceDefaults;
    injectionFactories.forEach((factory) => {
        application.inject(factory, 'resizeService', 'service:resize');
    });
}
export default {
    initialize,
    name: 'resize',
};
