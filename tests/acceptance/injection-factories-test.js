import { run } from '@ember/runloop';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';

let application;

module('Acceptance | injection factories', {
  beforeEach() {
    application = startApp();
  },

  afterEach() {
    run(application, 'destroy');
  }
});

function getViewById(viewId) {
  let view = application.componentById(viewId);
  return view;
}

test('Testing whether service has been injected onto views and components', (assert) => {
  visit('/injection-factories');

  andThen(() => {
    assert.equal(currentURL(), '/injection-factories', 'Test page loads');
    let viewId = find('.mike-view')[0].id;
    assert.ok(getViewById(viewId).get('resizeService'), 'resizeService has been injected onto views');
    let componentId = find('.test-component')[0].id;
    assert.ok(getViewById(componentId).get('resizeService'), 'resizeService has been injected onto components');
  });
});
