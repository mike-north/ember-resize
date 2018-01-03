import Component from '@ember/component';
import { A } from '@ember/array';
import ResizeAware from 'ember-resize/mixins/resize-aware';

export default Component.extend(ResizeAware, {
  classNames: ['index-view'],

  init() {
    this._super(...arguments);
    this.set('resizeEvents', A([]));
  },

  didResize(width, height) {
    this.get('resizeEvents').addObject({ width, height, debounced: false });
  },

  debouncedDidResize(width, height) {
    this.get('resizeEvents').addObject({ width, height, debounced: true });
  }
});
