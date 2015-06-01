import Ember from 'ember';
import ResizeAwareMixin from '../../../mixins/resize-aware';
import { module, test } from 'qunit';

module('Unit | Mixin | resize aware');

// Replace this with your real tests.
test('it works', function(assert) {
  let ResizeAwareObject = Ember.Object.extend(ResizeAwareMixin);
  let subject = ResizeAwareObject.create();
  assert.ok(subject);
});
