import Application from '@ember/application';import Resolver from './resolver';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver,
  componentById(viewId) {
    // jscs:disable disallowDirectPropertyAccess
    if (Ember.View) {
      let view = Ember.View.views ? Ember.View.views[viewId] : null;
      if (!view) {
        let newView = Ember.View.create();
        view = newView._viewRegistry[viewId];
      }
      return view;
    } else {
      return this.__container__.lookup('-view-registry:main')[viewId];
    }
    // jscs:enable disallowDirectPropertyAccess
  }
});

loadInitializers(App, config.modulePrefix);

export default App;
