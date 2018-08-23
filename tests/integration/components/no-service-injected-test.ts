import { render } from '@ember/test-helpers';
import { EmberRenderingTest } from 'ember-qunit-decorators/test-support';
import hbs from 'htmlbars-inline-precompile';
import { suite, test } from 'qunit-decorators';

@suite('Integration | Component | no-service-injected')
export class NoServiceInjectedComponentTest extends EmberRenderingTest {

  @test async 'it renders when used in {{inline-form}}'(assert: Assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{no-service-injected}}`);

    assert.equal(('' + this.element.textContent).trim(), 'Is the resize service automatically injected? false');
  }

}
