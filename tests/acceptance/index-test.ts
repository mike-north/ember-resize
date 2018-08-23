import { currentURL, find, visit } from '@ember/test-helpers';
import { EmberApplicationTest } from 'ember-qunit-decorators/test-support';
import { suite, test } from 'qunit-decorators';

@suite('Acceptance | index')
export class IndexAcceptanceTest extends EmberApplicationTest {

  @test async 'visiting /'(assert: Assert) {
    await visit('/');
    assert.equal(currentURL(), '/');

    const codeElement: Element | null = find('.index-view code');
    if (codeElement === null) { throw new Error('no <code>'); }
    assert.ok(/min\-width:\s[0-9]+px/.test('' + codeElement.textContent), 'min-width text found');
  }
}
