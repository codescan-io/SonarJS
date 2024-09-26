import { ESLint as ESLint9, Linter as Linter9 } from 'eslint9';
import { Linter as Linter8, Rule as Rule8 } from 'eslint8';
import * as Parser7 from '@typescript-eslint/parser7';
import * as Parser8 from '@typescript-eslint/parser8';
import assert from 'node:assert';

export const runTest = (
  code: string,
  rule: Rule8.RuleModule,
  expectations: Array<Omit<Linter8.LintMessage, 'ruleId'>>,
): void => {
  const linter8 = new Linter8();

  linter8.defineRule('test/candidate', rule);
  linter8.defineParser('typescript-eslint', Parser7 as Linter8.ParserModule);

  const linter8Messages = linter8.verify(code, {
    parser: 'typescript-eslint',
    rules: {
      'test/candidate': 'error',
    },
  });

  const linter9 = new Linter9();

  const linter9Messages = linter9.verify(code, {
    plugins: {
      test: {
        rules: {
          candidate: rule,
        },
      } as ESLint9.Plugin,
    },
    languageOptions: {
      parser: Parser8,
    },
    rules: {
      'test/candidate': 'error',
    },
  });

  expectations.forEach((expectation, index) => {
    const [linter8Message, linter9Message] = [linter8Messages[index], linter9Messages[index]];

    for (const message of [linter8Message, linter9Message]) {
      assert.equal(message.message, expectation.message);
      assert.equal(message.line, expectation.line);
      assert.equal(message.column, expectation.column);
      assert.equal(message.severity, expectation.severity);
      assert.equal(message.ruleId, 'test/candidate');

      if (expectation.endColumn !== undefined) {
        assert.equal(message.endColumn, expectation.endColumn);
      }
    }
  });
};
