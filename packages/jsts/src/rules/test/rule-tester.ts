/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2024 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
import { ESLint as ESLint9, Linter as Linter9 } from 'eslint9';
import { ESLint as ESLint8, Linter as Linter8, Rule as Rule8 } from 'eslint8';
import * as Parser7 from '@typescript-eslint/parser7';
import * as Parser8 from '@typescript-eslint/parser8';
import assert from 'node:assert';
import { describe, it } from 'node:test';

interface TestCase {
  code: string;
  filename: string;
  name?: string;
  options: Array<Record<string, unknown>>;
}

interface InvalidTestCase extends TestCase {
  errors: number | Array<Omit<Linter8.LintMessage, 'ruleId' | 'severity'>>;
}

type TestCases = {
  valid: Array<TestCase>;
  invalid: Array<InvalidTestCase>;
};

export class RuleTester {
  constructor(
    public readonly config: {
      parser: unknown;
      parserOptions: ESLint8.Environment['parserOptions'];
    },
  ) {}

  run(name: string, rule: Rule8.RuleModule, testCases: TestCases) {
    describe(name, () => {
      const linter8 = new Linter8();

      linter8.defineRule('test/candidate', rule);
      linter8.defineParser('typescript-eslint', Parser7 as Linter8.ParserModule);

      const linter9 = new Linter9();

      const getLinter8Messages = (testCase: TestCase): Array<Linter8.LintMessage> => {
        return linter8.verify(
          testCase.code,
          {
            parser: 'typescript-eslint',
            parserOptions: this.config.parserOptions,
            rules: {
              'test/candidate': ['error', testCase.options[0]],
            },
          },
          testCase.filename,
        );
      };

      const getLinter9Messages = (testCase: TestCase): Array<Linter9.LintMessage> => {
        return linter9.verify(
          testCase.code,
          {
            plugins: {
              test: {
                rules: {
                  candidate: rule,
                },
              } as ESLint9.Plugin,
            },
            languageOptions: {
              parser: Parser8,
              parserOptions: this.config.parserOptions,
            },
            rules: {
              'test/candidate': ['error', testCase.options[0]],
            },
            files: ['**/*.*', testCase.filename], // todo: I don't know why this is needed, @see https://github.com/eslint/eslint/issues/17577
          },
          testCase.filename,
        );
      };

      const getTestCaseName = (testCase: TestCase): string => {
        return testCase.name ?? testCase.code.split('\n')[0];
      };

      for (const testCase of testCases.valid) {
        const name = getTestCaseName(testCase);

        it(name, () => {
          const linter8Messages = getLinter8Messages(testCase);
          const linter9Messages = getLinter9Messages(testCase);

          assert.equal(linter8Messages.length, 0);
          assert.equal(linter9Messages.length, 0);
        });
      }

      for (const testCase of testCases.invalid) {
        const name = getTestCaseName(testCase);

        it(name, () => {
          const linter8Messages = getLinter8Messages(testCase);
          const linter9Messages = getLinter9Messages(testCase);

          if (typeof testCase.errors === 'number') {
            assert.equal(linter8Messages.length, testCase.errors);
            assert.equal(linter9Messages.length, testCase.errors);
          } else {
            assert.equal(linter9Messages.length, linter8Messages.length);

            testCase.errors.forEach((expectation, index) => {
              const [linter8Message, linter9Message] = [
                linter8Messages[index],
                linter9Messages[index],
              ];

              for (const message of [linter8Message, linter9Message]) {
                assert.equal(message.message, expectation.message);
                assert.equal(message.line, expectation.line);
                assert.equal(message.column, expectation.column);
                assert.equal(message.ruleId, 'test/candidate');

                if (expectation.endColumn !== undefined) {
                  assert.equal(message.endColumn, expectation.endColumn);
                }
              }
            });
          }
        });
      }
    });
  }
}
