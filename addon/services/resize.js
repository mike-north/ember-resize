import Ember from 'ember';

const { classify } = Ember.String;
const { map } = Ember.EnumerableUtils;

export default Ember.Service.extend(Ember.Evented, {

  _oldWidth: null,
  _oldHeight: null,
  _oldWidthDebounced: null,
  _oldHeightDebounced: null,

  debounceTimeout: Ember.computed.oneWay('defaultDebounceTimeout'),
  widthSensitive: Ember.computed.oneWay('defaultWidthSensitive'),
  heightSensitive: Ember.computed.oneWay('defaultHeightSensitive'),

  init() {
    this._super(...arguments);
    this._setDefaults();
    this._onResizeHandler = evt => {
      this._fireResizeNotification(evt);
      Ember.run.debounce(this, this._fireDebouncedResizeNotification, evt, this.get('debounceTimeout'));
    };
    this._installResizeListener();
  },

  destroy() {
    this._super(...arguments);
    this._uninstallResizeListener();
  },

  _setDefaults() {
    const defaults = Ember.getWithDefault(this, 'resizeServiceDefaults', {});
    map(Ember.keys(defaults), key => {
      const classifiedKey = classify(key);
      const defaultKey = `default${classifiedKey}`;
      return Ember.set(this, defaultKey, defaults[key]);
    });
  },

  _hasWindowSizeChanged(w, h, debounced=false) {
    return (this.get('widthSensitive') && (w !== this.get(`_oldWidth${debounced ? 'Debounced' : ''}`))) ||
          (this.get('heightSensitive') && (h !== this.get(`_oldHeight${debounced ? 'Debounced' : ''}`)));
  },

  _updateCachedWindowSize(w, h, debounced=false) {

    this.setProperties({
      [`_oldWidth${debounced ? 'Debounced' : ''}`]: w,
      [`_oldHeight${debounced ? 'Debounced' : ''}`]: h
    });
  },

  _installResizeListener() {
    Ember.$(window).on('resize', this._onResizeHandler);
  },

  _uninstallResizeListener() {
    Ember.$(window).off('resize', this._onResizeHandler);
  },

  _fireResizeNotification(evt) {
    const {innerWidth, innerHeight} = window;
    if (this._hasWindowSizeChanged(innerWidth, innerHeight)) {
      this.trigger('didResize', evt);
      this._updateCachedWindowSize(innerWidth, innerHeight);
    }
  },
  _fireDebouncedResizeNotification(evt) {
    const {innerWidth, innerHeight} = window;
    if (this._hasWindowSizeChanged(innerWidth, innerHeight, true)) {
      this.trigger('debouncedDidResize', evt);
      this._updateCachedWindowSize(innerWidth, innerHeight, true);
    }
  }
});
