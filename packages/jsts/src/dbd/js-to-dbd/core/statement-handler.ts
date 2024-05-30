import { TSESTree } from '@typescript-eslint/typescript-estree';
import type { Context } from './context-manager';
import { RequiredParserServices } from '../../../rules/helpers';

export type StatementHandler<Statement extends TSESTree.Statement = TSESTree.Statement> = (
  node: Statement,
  context: Context,
  fileName: string,
  services: RequiredParserServices,
) => void;
