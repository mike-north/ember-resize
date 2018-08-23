import { later } from '@ember/runloop';
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

  let evt = new window.Event('resize');

  window.dispatchEvent(evt);
  assert.equal(didResizeCallCount, 1, 'didResize called 1 time on event firing');
  service.incrementProperty('_oldHeight', -20);
  window.dispatchEvent(evt);
  assert.equal(didResizeCallCount, 2, 'didResize called another time on event firing again');
  service.set('heightSensitive', false);
  service.incrementProperty('_oldHeight', -20);
  window.dispatchEvent(evt);
  assert.equal(didResizeCallCount, 2, 'didResize shouldn\'t be called again if heightSensitive is false');

});

test('it fires "debouncedDidResize"  when the window is resized', function(assert) {

  let done = assert.async();

  let service = this.subject({
    widthSensitive: false,
    heightSensitive: true
  });

  let debouncedDidResizeCallCount = 0;
  service.on('debouncedDidResize', function() {
    debouncedDidResizeCallCount++;
  });

  let evt = new window.Event('resize');

  function triggerEvent() {
    window.dispatchEvent(evt);
  }

  for (let i = 0; i < 6; i++) {
    later(triggerEvent, 10);
  }

  assert.equal(debouncedDidResizeCallCount, 0, 'debouncedDidResize not called yet');
  later(() => {
    assert.equal(debouncedDidResizeCallCount, 1, 'debouncedDidResize called 1 time after 500ms');
    done();
  }, 500);

});
