import { computed, getWithDefault, set } from '@ember/object';
import { oneWay, readOnly } from '@ember/object/computed';
import Evented from '@ember/object/evented';
import { cancel, debounce } from '@ember/runloop';
import Service from '@ember/service';
import { classify } from '@ember/string';
class ResizeService extends Service.extend(Evented, {
    debounceTimeout: oneWay('defaultDebounceTimeout'),
    heightSensitive: oneWay('defaultHeightSensitive'),
    screenHeight: readOnly('_oldHeight'),
    screenWidth: readOnly('_oldWidth'),
    widthSensitive: oneWay('defaultWidthSensitive')
}) {
    constructor() {
        super(...arguments);
        this._oldWidth = window.innerWidth;
        this._oldHeight = window.innerHeight;
        this._oldWidthDebounced = window.innerWidth;
        this._oldHeightDebounced = window.innerHeight;
        this._setDefaults();
        this._onResizeHandler = evt => {
            this._fireResizeNotification(evt);
            const scheduledDebounce = debounce(this, this._fireDebouncedResizeNotification, evt, this.get('debounceTimeout'));
            this._scheduledDebounce = scheduledDebounce;
        };
        if (typeof FastBoot === 'undefined') {
            this._installResizeListener();
        }
    }
    destroy() {
        this._super(...arguments);
        if (typeof FastBoot === 'undefined') {
            this._uninstallResizeListener();
        }
        this._cancelScheduledDebounce();
        return this;
    }
    _setDefaults() {
        const defaults = getWithDefault(this, 'resizeServiceDefaults', {});
        Object.keys(defaults).map((key) => {
            const classifiedKey = classify(key);
            const defaultKey = `default${classifiedKey}`;
            return set(this, defaultKey, defaults[key]);
        });
    }
    _hasWindowSizeChanged(w, h, debounced = false) {
        const wKey = debounced ? '_oldWidthDebounced' : '_oldWidth';
        const hKey = debounced ? '_oldHeightDebounced' : '_oldHeight';
        return ((this.get('widthSensitive') && w !== this.get(wKey)) || (this.get('heightSensitive') && h !== this.get(hKey)));
    }
    _updateCachedWindowSize(w, h, debounced = false) {
        const wKey = debounced ? '_oldWidthDebounced' : '_oldWidth';
        const hKey = debounced ? '_oldHeightDebounced' : '_oldHeight';
        this.set(wKey, w);
        this.set(hKey, h);
    }
    _installResizeListener() {
        if (!this._onResizeHandler) {
            return;
        }
        window.addEventListener('resize', this._onResizeHandler);
    }
    _uninstallResizeListener() {
        if (!this._onResizeHandler) {
            return;
        }
        window.removeEventListener('resize', this._onResizeHandler);
    }
    _cancelScheduledDebounce() {
        if (!this._scheduledDebounce) {
            return;
        }
        cancel(this._scheduledDebounce);
    }
    _fireResizeNotification(evt) {
        const { innerWidth, innerHeight } = window;
        if (this._hasWindowSizeChanged(innerWidth, innerHeight)) {
            this.trigger('didResize', evt);
            this._updateCachedWindowSize(innerWidth, innerHeight);
        }
    }
    _fireDebouncedResizeNotification(evt) {
        const { innerWidth, innerHeight } = window;
        if (this._hasWindowSizeChanged(innerWidth, innerHeight, true)) {
            this.trigger('debouncedDidResize', evt);
            this._updateCachedWindowSize(innerWidth, innerHeight, true);
        }
    }
}
export default ResizeService;
