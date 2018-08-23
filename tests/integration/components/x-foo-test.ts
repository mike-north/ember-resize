import { render } from '@ember/test-helpers';
import { EmberRenderingTest } from 'ember-qunit-decorators/test-support';
import hbs from 'htmlbars-inline-precompile';
import { suite, test } from 'qunit-decorators';

@suite('Integration | Component | x-foo')
export class XFooComponentTest extends EmberRenderingTest {

  @test async 'it renders when used in {{inline-form}}'(assert: Assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`{{x-foo}}`);

    assert.equal(('' + this.element.textContent).trim(), '');
  }

  @test async 'it renders when used in {{#block-form}}  {{/block-form}}'(assert: Assert) {
    // Template block usage:
    await render(hbs`
      {{#x-foo}}
        template block text
      {{/x-foo}}
    `);

    assert.equal(('' + this.element.textContent).trim(), 'template block text');
  }
}
