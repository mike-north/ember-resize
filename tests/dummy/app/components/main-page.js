import Ember from 'ember';

const { Component, A } = Ember;

export default Component.extend({

  init() {
    this._super(...arguments);
    this.set('resizeEvents', A([]));
  },

  didInsertElement() {
    this._super(...arguments);
    this.get('resizeService').on('debouncedDidResize', () => {
      this.get('resizeEvents').addObject({
        width: window.innerWidth,
        height: window.innerHeight,
        debounced: true
      });
    });
    this.get('resizeService').on('didResize', () => {
      this.get('resizeEvents').addObject({
        width: window.innerWidth,
        height: window.innerHeight,
        debounced: false
      });
    });
  }
});
