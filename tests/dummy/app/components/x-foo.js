import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
  classNames: ['test-component'],
  resize: inject()
});
