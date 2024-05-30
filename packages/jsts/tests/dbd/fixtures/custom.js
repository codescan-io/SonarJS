import path from 'node:path';

function loadAll(pluginNames) {
  pluginNames(); // Noncompliant: pluginNames might be undefined
}
loadAll(null);
console.log(path.dirname(__dirname));