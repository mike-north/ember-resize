import Ember from 'ember';

export default Ember.View.extend({
  resizeEvents: Ember.A([]),
  didInsertElement() {
    this._super(...arguments);
    this.get('resizeService').on('debouncedDidResize', evt => {
      this.get('resizeEvents').addObject({
        width: window.innerWidth,
        height: window.innerHeight,
        debounced: true
      });
    });
    this.get('resizeService').on('didResize', evt => {
      this.get('resizeEvents').addObject({
        width: window.innerWidth,
        height: window.innerHeight,
        debounced: false
      });
    });
  }
});
