import path from './custom2';
import * as path2 from './custom2';
import {bar} from './custom2';

function loadAll(pluginNames) {
  pluginNames(); // Noncompliant: pluginNames might be undefined
}
loadAll(null);
console.log(path.dirname(__dirname));
