import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import configuration from 'ember-resize/configuration';

const { run } = Ember;

let application;

module('Acceptance | Configuration', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    run(application, 'destroy');
  }
});

test('Ensure config values set in consuming application config are mirrored on the resize service', (assert) => {
  // because we set the resizeServiceDefaults.debounceTimeout to 500 in the dummy app config.
  assert.equal(configuration.debounceTimeout, 500);
});
