import path from './custom2';
import * as path2 from './custom2';
import {bar, foo} from './custom2';

//sourceCode.parserServices.project.getSourceFiles()[0].getChildren()[0].getChildren()[3].getChildren()[0].getChildren()[1].getChildren()[0].getChildren()[2].getChildren()[1].getChildren()[0].getChildren()[0].findReferences()
//sourceCode.parserServices.project.getSourceFiles()[0].getChildren()[0].getChildren()[3].getChildren()[0].getChildren()[1].getChildren()[0].getChildren()[2].getChildren()[1].getChildren()[0].getChildren()[0].getDefinitions()
//sourceCode.parserServices.project.getSourceFiles()[0].getChildren()[0].getChildren()[3].getChildren()[0].getChildren()[1].getChildren()[0].getChildren()[2].getChildren()[1].getChildren()[0].getChildren()[2]
const a = {
  b: () => {}
}

function loadAll(pluginNames) {
  pluginNames(); // Noncompliant: pluginNames might be undefined
}

foo.bar =1;
//sourceCode.parserServices.project.getSourceFiles()[0].getChildren()[0].getChildren()[6].getChildren()[0].getChildren()[0].getChildren()[2].findReferences()
a.b();
loadAll(null);
loadAll('foo');
loadAll(() => {});
console.log(path.dirname(__dirname));
bar();