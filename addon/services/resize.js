import { keys as emberKeys } from '@ember/polyfills';
import Service from '@ember/service';
import Evented from '@ember/object/evented';
import { classify } from '@ember/string';
import { oneWay, readOnly } from '@ember/object/computed';
import { debounce, cancel } from '@ember/runloop';
import EmberObject, { set, getWithDefault } from '@ember/object';

// jscs:disable disallowDirectPropertyAccess
const Base = Service || EmberObject;
const keys = Object.keys || emberKeys;

export default Base.extend(Evented, {
  _oldWidth: window.innerWidth,
  _oldHeight: window.innerHeight,
  _oldWidthDebounced: window.innerWidth,
  _oldHeightDebounced: window.innerHeight,
  debounceTimeout: oneWay('defaultDebounceTimeout'),
  widthSensitive: oneWay('defaultWidthSensitive'),
  heightSensitive: oneWay('defaultHeightSensitive'),

  screenWidth: readOnly('_oldWidth'),
  screenHeight: readOnly('_oldHeight'),

  init() {
    this._super(...arguments);
    this._setDefaults();
    this._onResizeHandler = evt => {
      this._fireResizeNotification(evt);
      let scheduledDebounce = debounce(this, this._fireDebouncedResizeNotification, evt, this.get('debounceTimeout'));
      this._scheduledDebounce = scheduledDebounce;
    };
    if (typeof FastBoot === 'undefined') {
      this._installResizeListener();
    }
  },

  destroy() {
    this._super(...arguments);
    if (typeof FastBoot === 'undefined') {
      this._uninstallResizeListener();
    }
    this._cancelScheduledDebounce();
  },

  _setDefaults() {
    const defaults = getWithDefault(this, 'resizeServiceDefaults', {});

    keys(defaults).map(key => {
      const classifiedKey = classify(key);
      const defaultKey = `default${classifiedKey}`;
      return set(this, defaultKey, defaults[key]);
    });
  },

  _hasWindowSizeChanged(w, h, debounced = false) {
    return (
      (this.get('widthSensitive') && w !== this.get(`_oldWidth${debounced ? 'Debounced' : ''}`)) ||
      (this.get('heightSensitive') && h !== this.get(`_oldHeight${debounced ? 'Debounced' : ''}`))
    );
  },

  _updateCachedWindowSize(w, h, debounced = false) {
    const wKey = `_oldWidth${debounced ? 'Debounced' : ''}`;
    const hKey = `_oldHeight${debounced ? 'Debounced' : ''}`;
    let props = {};
    props[wKey] = w;
    props[hKey] = h;
    this.setProperties(props);
  },

  _installResizeListener() {
    window.addEventListener('resize', this._onResizeHandler);
  },

  _uninstallResizeListener() {
    window.removeEventListener('resize', this._onResizeHandler);
  },

  _cancelScheduledDebounce() {
    cancel(this._scheduledDebounce);
  },

  _fireResizeNotification(evt) {
    const { innerWidth, innerHeight } = window;
    if (this._hasWindowSizeChanged(innerWidth, innerHeight)) {
      this.trigger('didResize', evt);
      this._updateCachedWindowSize(innerWidth, innerHeight);
    }
  },
  _fireDebouncedResizeNotification(evt) {
    const { innerWidth, innerHeight } = window;
    if (this._hasWindowSizeChanged(innerWidth, innerHeight, true)) {
      this.trigger('debouncedDidResize', evt);
      this._updateCachedWindowSize(innerWidth, innerHeight, true);
    }
  }
});
