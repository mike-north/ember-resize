import { ResizeDefaults } from 'ember-resize/services/resize';

interface IEnvironment {
  resizeServiceDefaults: ResizeDefaults;
}
declare const env: IEnvironment;
export = env;
