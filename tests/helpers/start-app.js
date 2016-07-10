import Ember from 'ember';
import Application from '../../app';
import config from '../../config/environment';

const { run } = Ember;

export default function startApp(attrs) {
  let application;
  // jscs:disable disallowDirectPropertyAccess
  let combine = Ember.assign || Ember.merge;
  // jscs:enable disallowDirectPropertyAccess

  let attributes = combine({}, config.APP);
  attributes = combine(attributes, attrs); // use defaults, but you can override;

  run(() => {
    application = Application.create(attributes);
    application.setupForTesting();
    application.injectTestHelpers();
  });

  return application;
}
