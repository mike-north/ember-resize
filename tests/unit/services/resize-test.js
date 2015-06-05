import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

moduleFor('service:resize', 'Unit | Service | resize', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

test('it fires "didResize"  when the window is resized', function(assert) {

  let service = this.subject({
    widthSensitive: false,
    heightSensitive: true
  });
  let didResizeCallCount = 0;
  service.on('didResize', function() {
    didResizeCallCount++;
  });

  Ember.$(window).trigger('resize');

  service.incrementProperty('_oldHeight', -20);

  Ember.$(window).trigger('resize');

  assert.equal(didResizeCallCount, 2, 'didResize called another time on event firing again');
  service.set('heightSensitive', false);
  service.incrementProperty('_oldHeight', -20);

  Ember.$(window).trigger('resize');

  assert.equal(didResizeCallCount, 2, 'didResize shouldn\'t be called again if heightSensitive is false');

});

test('it fires "debouncedDidResize"  when the window is resized', function(assert) {

  QUnit.stop();

  let service = this.subject({
    widthSensitive: false,
    heightSensitive: true
  });

  let debouncedDidResizeCallCount = 0;
  service.on('debouncedDidResize', function() {
    debouncedDidResizeCallCount++;
  });

  let evtCount = 0;

  function triggerEvent() {
    Ember.$(window).trigger('resize');
  }

  for (let i = 0; i < 6; i++) {
    Ember.run.next(triggerEvent);
  }

  assert.equal(debouncedDidResizeCallCount, 0, 'debouncedDidResize not called yet');
  Ember.run.later(() => {
    assert.equal(debouncedDidResizeCallCount, 1, 'debouncedDidResize called 1 time after 500ms');
    QUnit.start();
  }, 500);
});
