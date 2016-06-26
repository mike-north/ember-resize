import Ember from 'ember';
import ResizeAwareMixin from '../../../mixins/resize-aware';
import { module, test } from 'qunit';

// jscs:disable disallowDirectPropertyAccess
const Obj = Ember.Object;
// jscs:enable disallowDirectPropertyAccess

module('Unit | Mixin | resize aware');

test('didResize and debouncedDidResize hooks are on the object', function(assert) {

  let ResizeAwareObject = Obj.extend(ResizeAwareMixin);
  let subject = ResizeAwareObject.create();

  assert.ok(subject.didResize, 'didResize hook is present on the subject');
  assert.equal(typeof subject.didResize, 'function', 'didResize hook is a function');
  assert.ok(subject.debouncedDidResize, 'debouncedDidResize hook is present on the subject');
  assert.equal(typeof subject.debouncedDidResize, 'function', 'debouncedDidResize hook is a function');

});
