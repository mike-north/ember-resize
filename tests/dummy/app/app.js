import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';

const { Application } = Ember;

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Application.extend({
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
      // jscs:enable disallowDirectPropertyAccess

      return view;
    } else {
      return this.__container__.lookup('-view-registry:main')[viewId];
    }
  }
});

loadInitializers(App, config.modulePrefix);

export default App;
