import Ember from 'ember';
import ResizeAware from 'ember-resize/mixins/resize-aware';

export default Ember.View.extend(ResizeAware, {
  classNames: ['index-view'],
  resizeEvents: Ember.A([]),

  didResize(width, height) {
    this.get('resizeEvents').addObject({ width, height, debounced: false });
  },

  debouncedDidResize(width, height) {
    this.get('resizeEvents').addObject({ width, height, debounced: true });
  }
});
