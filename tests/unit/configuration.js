import configuration from 'ember-resize/configuration';
import { module, test } from 'qunit';

module('Unit | Configuration', {
  afterEach() {
    configuration.load({});
  }
});

test('widthSensitive defaults to true', function(assert) {
  configuration.load({});
  assert.ok(configuration.widthSensitive);
});

test('heightSensitive defaults to true', function(assert) {
  configuration.load({});
  assert.ok(configuration.heightSensitive);
});

test('debounceTimeout defaults to 200', function(assert) {
  configuration.load({});
  assert.equal(configuration.debounceTimeout, 200);
});

test('injectionFactories defaults to an array of ["view", "component"]', function(assert) {
  configuration.load({});
  assert.equal(configuration.injectionFactories, ['view', 'component']);
});

test('configuration.load sets widthSensitive correctly', function(assert) {
  configuration.load({ widthSensitive: false });
  assert.ok(!configuration.widthSensitive);
});

test('configuration.load sets heightSensitive correctly', function(assert) {
  configuration.load({ heightSensitive: false });
  assert.ok(!configuration.heightSensitive);
});

test('configuration.load sets debounceTimeout correctly', function(assert) {
  configuration.load({ debounceTimeout: 500 });
  assert.equal(configuration.debounceTimeout, 500);
});

test('configuration.load sets injectionFactories correctly', function(assert) {
  configuration.load({ injectionFactories: [] });
  assert.equal(configuration.injectionFactories, []);
});
