import Application from '@ember/application';

import ApplicationInstance from '@ember/application/instance';
import { run } from '@ember/runloop';
import { initialize } from 'dummy/initializers/resize';
import { EmberTest } from 'ember-qunit-decorators/test-support';
import { suite, test } from 'qunit-decorators';

@suite('Unit | Initializer | resize')
export class ResizeInitializerTest extends EmberTest {
  private testApplication!: typeof Application;
  private application!: Application;
  private instance!: ApplicationInstance;

  public async beforeEach() {
    this.testApplication = Application.extend();

    this.application = this.testApplication.create({ autoboot: false });
    this.instance = (this.application as any).buildInstance();
    initialize(this.instance);
  }
  public afterEach() {
    run(this.application, 'destroy');
  }

  @test
  public 'service is registered to the container'(assert: Assert) {
    // tslint:disable-next-line:no-debugger
    assert.ok(
      this.instance.lookup('service:resize'),
      'registered as service:resize in the container after initializer',
    );
  }

  @test
  public 'service configuration is registered to the container'(assert: Assert) {
    assert.ok(
      this.instance.lookup('config:resize-service'),
      'registered as config:resize-service in the container after initializer',
    );
  }

  @test
  public 'service configuration is injected onto the resize service'(assert: Assert) {
    const resize = this.instance.lookup('service:resize');
    assert.deepEqual(
      resize.get('resizeServiceDefaults'),
      this.instance.lookup('config:resize-service'),
      'defaults are registered to service as "resizeServiceDefaults"',
    );
  }
}
