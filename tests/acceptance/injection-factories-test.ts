import ApplicationInstance from '@ember/application/instance';
import { currentURL, find, visit } from '@ember/test-helpers';
import { EmberApplicationTest } from 'ember-qunit-decorators/test-support';
import { suite, test } from 'qunit-decorators';

function getViewById(this: { owner: ApplicationInstance}, viewId: string) {
  return this.owner.lookup('-view-registry:main')[viewId];
}

@suite('Acceptance | injection factories')
export class InjectionFactoriesAcceptanceTest extends EmberApplicationTest {

  @test public async 'visiting /injection-factories'(assert: Assert) {
    await visit('/injection-factories');

    assert.equal(currentURL(), '/injection-factories', 'Test page loads');
    const view = find('.mike-view');
    assert.ok(view, '.mike-view found');
    if (!view) { throw new Error(''); }
    const viewId = view.id;
    assert.ok(getViewById.call(this, viewId).get('resizeService'), 'resizeService has been injected onto views');
    const component = find('.test-component');
    assert.ok(component, '.test-component found');
    if (!component) { throw new Error(''); }
    const componentId = component.id;
    // tslint:disable-next-line:max-line-length
    assert.ok(getViewById.call(this, componentId).get('resizeService'), 'resizeService has been injected onto components');

  }
}
