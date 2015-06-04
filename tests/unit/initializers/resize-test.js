import Ember from 'ember';
import { initialize } from '../../../initializers/resize';
import { module, test } from 'qunit';

let container, application;

module('Unit | Initializer | resize', {
  needs: ['service:resize'],
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      container = application.__container__;
      application.deferReadiness();
    });
  }
});

test('service is registered to the container', function(assert) {
  assert.ok(!application.__container__.lookup('service:resize'), 'not registered as service:resize in the container before initializer');
  initialize(container, application);
  assert.ok(application.__container__.lookup('service:resize'), 'registered as service:resize in the container after initializer');
});

test('service configuration is registered to the container', function(assert) {
  assert.ok(!application.__container__.lookup('config:resize-service'), 'not registered as config:resize-service in the container before initializer');
  initialize(container, application);
  assert.ok(application.__container__.lookup('config:resize-service'), 'registered as config:resize-service in the container after initializer');
});

test('service configuration is injected onto the resize service', function(assert) {
  initialize(container, application);
  let resize = application.__container__.lookup('service:resize');
  assert.deepEqual(resize.get('resizeServiceDefaults'), application.__container__.lookup('config:resize-service'), 'defaults are registered to service as "resizeServiceDefaults"');
});

