import Ember from 'ember';
import { initialize } from '../../../initializers/resize';
import { module, test } from 'qunit';

const { run, Application } = Ember;

let container, application;

module('Unit | Initializer | resize', {
  needs: ['service:resize'],
  beforeEach() {
    run(function() {
      application = Application.create();
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
