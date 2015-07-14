import Ember from 'ember';

export default Ember.Mixin.create({
  resizeEventsEnabled: true,
  resizeDebouncedEventsEnabled: true,

  _oldViewWidth: null,
  _oldViewHeight: null,
  _oldViewWidthDebounced: null,
  _oldViewHeightDebounced: null,
  resizeWidthSensitive: true,
  resizeHeightSensitive: false,

  didInsertElement() {
    this._super(...arguments);
    if (this.get('resizeEventsEnabled')) {
      this.get('resizeService').on('didResize', this, this._handleResizeEvent);
    }
    if (this.get('resizeDebouncedEventsEnabled')) {
      this.get('resizeService').on('debouncedDidResize', this, this._handleDebouncedResizeEvent);
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    if (this.get('resizeEventsEnabled')) {
      this.get('resizeService').off('didResize', this, this._handleResizeEvent);
    }
    if (this.get('resizeDebouncedEventsEnabled')) {
      this.get('resizeService').off('debouncedDidResize', this, this._handleDebouncedResizeEvent);
    }
  },

  didResize(/*width, height, evt*/) {}, // Overridden in subclass
  debouncedDidResize(/*width, height, evt*/) {}, // Overridden in subclass

  _getComponentSize() {
    return this.$()[0].getClientRects()[0];
  },

  _handleResizeEvent(evt) {
    const w = Math.floor(this._getComponentSize().width);
    const h = Math.floor(this._getComponentSize().height);
    if ((this.get('resizeWidthSensitive') && (this.get('_oldViewWidth') !== w)) ||
      (this.get('resizeHeightSensitive') && (this.get('_oldViewHeight') !== h))) {
      this.didResize(w, h, evt);
      this.setProperties({
        _oldViewWidth: w,
        _oldViewHeight: h
      });
    }
  },

  _handleDebouncedResizeEvent(evt) {
    const w = Math.floor(this._getComponentSize().width);
    const h = Math.floor(this._getComponentSize().height);
    if ((this.get('resizeWidthSensitive') && (this.get('_oldViewWidthDebounced') !== w)) ||
      (this.get('resizeHeightSensitive') && (this.get('_oldViewHeightDebounced') !== h))) {
      this.debouncedDidResize(w, h, evt);
      this.setProperties({
        _oldViewWidthDebounced: w,
        _oldViewHeightDebounced: h
      });
    }
  }
});
