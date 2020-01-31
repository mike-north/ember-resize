import { computed, getWithDefault, set } from '@ember/object';
import Evented from '@ember/object/evented';
import { cancel, debounce } from '@ember/runloop';
import Service from '@ember/service';
import { classify } from '@ember/string';

declare global {
  // tslint:disable-next-line:variable-name
  const FastBoot: {} | undefined;
}

export interface ResizeDefaults {
  widthSensitive?: boolean;
  heightSensitive?: boolean;
  debounceTimeout?: number;
  injectionFactories?: string[];
}

// This is a workaround to define the `resizeServiceDefaults` property on the
// *type* `ResizeService`, while not stomping the property with a default value
// of `void 0`: per the ES spec, a property declared on a class body with no
// value is equivalent to `defineProperty(this, 'propertyName', void 0, ...)`.
// Once this project is upgraded to use TS 3.7+, this can be replace dwith the
// use of `declare resizeServiceDefaults: Partial<ResizeDefaults>` on the class.
interface ResizeService {
  resizeServiceDefaults: Partial<ResizeDefaults>;
}

class ResizeService extends Service.extend(Evented, {
  debounceTimeout: computed.oneWay('defaultDebounceTimeout'),
  heightSensitive: computed.oneWay('defaultHeightSensitive'),
  screenHeight: computed.readOnly('_oldHeight'),
  screenWidth: computed.readOnly('_oldWidth'),
  widthSensitive: computed.oneWay('defaultWidthSensitive'),
}) {
  public _oldWidth = window.innerWidth;
  public _oldHeight = window.innerHeight;
  public _oldWidthDebounced = window.innerWidth;
  public _oldHeightDebounced = window.innerHeight;

  public _onResizeHandler?: (this: Window, evt: UIEvent) => void;
  public _scheduledDebounce?: ReturnType<typeof debounce>;
  constructor() {
    super(...arguments);
    this._setDefaults();
    this._onResizeHandler = evt => {
      this._fireResizeNotification(evt);
      const scheduledDebounce = debounce(this, this._fireDebouncedResizeNotification, evt, this.get('debounceTimeout'));
      this._scheduledDebounce = scheduledDebounce;
    };
    if (typeof FastBoot === 'undefined') {
      this._installResizeListener();
    }
  }

  public destroy() {
    this._super(...arguments);
    if (typeof FastBoot === 'undefined') {
      this._uninstallResizeListener();
    }
    this._cancelScheduledDebounce();
    return this;
  }

  public _setDefaults() {
    const defaults = getWithDefault(this, 'resizeServiceDefaults', {} as any);

    Object.keys(defaults).map((key: keyof ResizeDefaults) => {
      const classifiedKey = classify(key);
      const defaultKey = `default${classifiedKey}`;
      return set(this as any, defaultKey, defaults[key]);
    });
  }

  public _hasWindowSizeChanged(w: number, h: number, debounced = false) {
    const wKey = debounced ? '_oldWidthDebounced' : '_oldWidth';
    const hKey = debounced ? '_oldHeightDebounced' : '_oldHeight';
    return (
      (this.get('widthSensitive') && w !== this.get(wKey)) || (this.get('heightSensitive') && h !== this.get(hKey))
    );
  }

  public _updateCachedWindowSize(w: number, h: number, debounced = false) {
    const wKey = debounced ? '_oldWidthDebounced' : '_oldWidth';
    const hKey = debounced ? '_oldHeightDebounced' : '_oldHeight';
    this.set(wKey, w);
    this.set(hKey, h);
  }

  public _installResizeListener() {
    if (!this._onResizeHandler) {
      return;
    }
    window.addEventListener('resize', this._onResizeHandler);
  }

  public _uninstallResizeListener() {
    if (!this._onResizeHandler) {
      return;
    }
    window.removeEventListener('resize', this._onResizeHandler);
  }

  public _cancelScheduledDebounce() {
    if (!this._scheduledDebounce) {
      return;
    }
    cancel(this._scheduledDebounce);
  }

  public _fireResizeNotification(evt: UIEvent) {
    const { innerWidth, innerHeight } = window;
    if (this._hasWindowSizeChanged(innerWidth, innerHeight)) {
      this.trigger('didResize', evt);
      this._updateCachedWindowSize(innerWidth, innerHeight);
    }
  }
  public _fireDebouncedResizeNotification(evt: UIEvent) {
    const { innerWidth, innerHeight } = window;
    if (this._hasWindowSizeChanged(innerWidth, innerHeight, true)) {
      this.trigger('debouncedDidResize', evt);
      this._updateCachedWindowSize(innerWidth, innerHeight, true);
    }
  }
}

export default ResizeService;
