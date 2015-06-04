import { moduleFor, test } from 'ember-qunit';

moduleFor('service:resize', 'Unit | Service | resize', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

test('it fires "didResize"  when the window is resized', function (assert) {

  let service = this.subject({
    widthSensitive: false,
    heightSensitive: true
  });
  let didResizeCallCount = 0;
  service.on('didResize', function() {
    didResizeCallCount++;
  });

  var evt = new window.Event('resize');

  window.dispatchEvent(evt);
  assert.equal(didResizeCallCount, 1, 'didResize called 1 time on event firing');
  window.innerHeight -= 21;
  window.dispatchEvent(evt);
  assert.equal(didResizeCallCount, 2, 'didResize called another time on event firing again');
  service.set('heightSensitive', false);
  window.innerHeight -= 21;
  window.dispatchEvent(evt);
  assert.equal(didResizeCallCount, 2, 'didResize shouldn\'t be called again if heightSensitive is false');

});


test('it fires "debouncedDidResize"  when the window is resized', function (assert) {

  QUnit.stop();

  let service = this.subject({
    widthSensitive: false,
    heightSensitive: true
  });
  let debouncedDidResizeCallCount = 0;
  service.on('debouncedDidResize', function() {
    debouncedDidResizeCallCount++;
  });

  let evt = new window.Event('resize');
  let evtCount = 0;
  let barrage = setInterval(() => {
    if (evtCount < 6) {
      window.dispatchEvent(evt);
    }
    else {
      window.clearInterval(barrage);
    }
  }, 5);
  assert.equal(debouncedDidResizeCallCount, 0, 'debouncedDidResize not called yet');

  setTimeout(() => {
    assert.equal(debouncedDidResizeCallCount, 1, 'debouncedDidResize called 1 time after 500ms');
    QUnit.start();
  }, 200);

});
