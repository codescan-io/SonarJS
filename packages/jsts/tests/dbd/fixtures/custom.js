import path from './custom2';
import * as path2 from './custom2';
import {bar, foo} from './custom2';

function loadAll(pluginNames) {
  pluginNames(); // Noncompliant: pluginNames might be undefined
}

foo.bar =1;

loadAll(null);
console.log(path.dirname(__dirname));
bar();