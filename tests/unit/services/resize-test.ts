import { later } from '@ember/runloop';
import { moduleFor, test } from 'ember-qunit';

moduleFor('service:resize', 'Unit | Service | resize', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

test('it fires "didResize"  when the window is resized', function(assert) {

  const service = this.subject({
    heightSensitive: true,
    widthSensitive: false,
  });
  let didResizeCallCount = 0;
  service.on('didResize', () => {
    didResizeCallCount++;
  });

  const evt = new Event('resize');

  window.dispatchEvent(evt);
  assert.equal(didResizeCallCount, 0, 'didResize called 0 time on event firing');
  service.incrementProperty('_oldHeight', -20);
  window.dispatchEvent(evt);
  assert.equal(didResizeCallCount, 1, 'didResize called 1 time on event firing');
  service.set('heightSensitive', false);
  service.incrementProperty('_oldHeight', -20);
  window.dispatchEvent(evt);
  assert.equal(didResizeCallCount, 1, 'didResize shouldn\'t be called again if heightSensitive is false');

});

test('screenHeight is bound to the non debounced resize', function(assert) {

  const service = this.subject({
    heightSensitive: true,
    widthSensitive: false,
  });

  const evt = new Event('resize');

  window.dispatchEvent(evt);
  assert.equal(service.get('screenHeight'), window.innerHeight);

});

test('it fires "debouncedDidResize"  when the window is resized', function(assert) {

  const done = assert.async();

  const service = this.subject({
    heightSensitive: true,
    widthSensitive: false,
  });

  let debouncedDidResizeCallCount = 0;
  service.on('debouncedDidResize', () => {
    debouncedDidResizeCallCount++;
  });

  const evt = new Event('resize');

  function triggerEvent() {
    window.dispatchEvent(evt);
  }

  for (let i = 0; i < 6; i++) {
    later(triggerEvent, 10);
  }

  service.incrementProperty('_oldHeightDebounced', -20);
  assert.equal(debouncedDidResizeCallCount, 0, 'debouncedDidResize not called yet');
  later(() => {
    assert.equal(debouncedDidResizeCallCount, 1, 'debouncedDidResize called 1 time after 500ms');
    done();
  }, 500);

});
