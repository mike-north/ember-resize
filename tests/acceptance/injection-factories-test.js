import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { currentURL, visit, find } from '@ember/test-helpers';

function getViewById(viewId) {
  return this.owner.lookup('-view-registry:main')[viewId];
}

module('Acceptance | injection factories', function(hooks) {
  setupApplicationTest(hooks);

  test('Testing whether service has been injected onto views and components', async function(assert) {
    await visit('/injection-factories');

    assert.equal(currentURL(), '/injection-factories', 'Test page loads');
    let viewId = find('.mike-view').id;
    assert.ok(getViewById.call(this, viewId).get('resizeService'), 'resizeService has been injected onto views');
    let componentId = find('.test-component').id;
    assert.ok(getViewById.call(this, componentId).get('resizeService'), 'resizeService has been injected onto components');
  });
});
