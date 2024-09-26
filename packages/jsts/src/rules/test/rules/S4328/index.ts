import { describe, it } from 'node:test';
import { runTest } from '../../test-runner';
import { S4328 } from '../../../main/S4328';

describe('S4328', () => {
  it('triggers on undeclared imported module', () => {
    runTest('import {foo} from "bar";', S4328, [
      {
        message: 'Either remove this import or add it as a dependency.',
        column: 1,
        line: 1,
        severity: 2,
        endColumn: 7,
      },
    ]);
  });
});
