import Ember from 'ember';

// jscs:disable disallowDirectPropertyAccess
const Base = Ember.Service || Ember.Object;
const keys = Object.keys || Ember.keys;
// jscs:enable disallowDirectPropertyAccess

const { Evented, String: { classify }, computed: { oneWay }, run: { debounce, cancel }, getWithDefault, set } = Ember;

export default Base.extend(Evented, {
  _oldWidth: null,
  _oldHeight: null,
  _oldWidthDebounced: null,
  _oldHeightDebounced: null,
  _scheduledDebounce: null,

  debounceTimeout: oneWay('defaultDebounceTimeout'),
  widthSensitive: oneWay('defaultWidthSensitive'),
  heightSensitive: oneWay('defaultHeightSensitive'),

  init() {
    this._super(...arguments);
    this._setDefaults();
    this._onResizeHandler = (evt) => {
      this._fireResizeNotification(evt);
      let scheduledDebounce = debounce(this, this._fireDebouncedResizeNotification, evt, this.get('debounceTimeout'));
      this._scheduledDebounce = scheduledDebounce;
    };
    this._installResizeListener();
  },

  destroy() {
    this._super(...arguments);
    this._uninstallResizeListener();
    this._cancelScheduledDebounce();
  },

  _setDefaults() {
    const defaults = getWithDefault(this, 'resizeServiceDefaults', {});

    keys(defaults).map((key) => {
      const classifiedKey = classify(key);
      const defaultKey = `default${classifiedKey}`;
      return set(this, defaultKey, defaults[key]);
    });
  },

  _hasWindowSizeChanged(w, h, debounced=false) {
    return (this.get('widthSensitive') && (w !== this.get(`_oldWidth${debounced ? 'Debounced' : ''}`))) ||
          (this.get('heightSensitive') && (h !== this.get(`_oldHeight${debounced ? 'Debounced' : ''}`)));
  },

  _updateCachedWindowSize(w, h, debounced=false) {
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
