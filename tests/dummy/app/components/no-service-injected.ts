import Component from '@ember/component';
import { computed } from '@ember/object';
// @ts-ignore: Ignore import of compiled template
import layout from '../templates/components/no-service-injected';

export default class NoServiceInjected extends Component.extend({
  layout,
  resizeIsTruthy: computed('resize', function() {
    return !!this.get('resize');
  }),
}) {
}
