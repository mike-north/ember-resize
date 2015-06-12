# Ember-resize

[![Build Status](https://travis-ci.org/truenorth/ember-resize.svg?branch=master)](https://travis-ci.org/truenorth/ember-resize)
[![Code Climate](https://codeclimate.com/github/truenorth/ember-resize/badges/gpa.svg)](https://codeclimate.com/github/truenorth/ember-resize)
[![npm version](https://badge.fury.io/js/ember-resize.svg)](http://badge.fury.io/js/ember-resize)
[![Ember Observer Score](http://emberobserver.com/badges/ember-resize.svg)](http://emberobserver.com/addons/ember-resize)
[![Dependency Status](https://david-dm.org/truenorth/ember-resize.svg)](https://david-dm.org/truenorth/ember-resize)
[![devDependency Status](https://david-dm.org/truenorth/ember-resize/dev-status.svg)](https://david-dm.org/truenorth/ember-resize#info=devDependencies)

Respond to window and view resize events easily and reliably. Events are only fired when dimensions actually change, and you may choose to respond to only width changes, only height changes, or changes to both.

### Use

* ember-cli < 0.2.3 `ember install:addon ember-resize`
* ember-cli >= 0.2.3 `ember install ember-resize`


### Service: `Resize`

The resize service makes it easy to respond to window resize events. By default it is injected onto your views and components, but you may change this via configuration. 

This service fires two events
* `didResize` - Fires anytime the window is resized
* `debouncedDidResize` - Identical to `didResize`, but debounced (configurable, 100ms by default)

An example of how you might use this service:

```js
let MyView = Ember.View.extend({
  init() {
    this.get('resizeService').on('didResize', event => {
      console.log(`width: ${window.innerWidth}, height: ${window.innerHeight}`);
    })
  }
})
```

### Mixin: `ResizeAware`

A little sugar on top of the service, making it as easy as possible to respond to resize events in an ember-idiomatic way. Just as you can implement mouse events on your views via methods like `click`, you can now implement `didResize` and `debouncedDidResize` methods as well.

```js
import ResizeAware from 'ember-resize/mixins/resize-aware';

let MyOtherView = Ember.View.extend(ResizeAware, {
  didResize(width, height, evt) {
    console.log(`Resized! ${width}x${height}`);
  },
  debouncedDidResize(width, height, evt) {
    console.log(`Debounced Resize! ${width}x${height}`);
  }
})
```

### Configuration

in your `config/environment.js`, you may configure some options

```js
module.exports = function(environment) {
  var ENV = {
    resizeServiceDefaults: {
      debounceTimeout    : 200,
      heightSensitive    : false,
      widthSensitive     : true,
      injectionFactories : [ 'view', 'component']
    }
  }
}
```

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
