import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/typescript-estree';
import type { StatementHandler } from '../statement-handler';
import type { Instruction } from '../instruction';
import { Context } from '../context-manager';
import { RequiredParserServices } from '../../../../rules/helpers';
import { SyntaxKind, Declaration } from 'typescript';

export const handleImportDeclaration: StatementHandler<TSESTree.ImportDeclaration> = (
  node,
  context,
  _fileName,
  services,
) => {
  const { blockManager } = context;
  const { getCurrentBlock } = blockManager;
  const instructions: Array<Instruction> = [];

  for (const specifier of node.specifiers) {
    const { instructions: declarationInstruction } = handleSpecifier(specifier, context, services);

    instructions.push(...declarationInstruction);
  }

  getCurrentBlock().instructions.push(...instructions);
};

function handleSpecifier(
  node: TSESTree.ImportClause,
  _context: Context,
  services: RequiredParserServices,
) {
  const instructions: Array<Instruction> = [];
  const checker = services.program.getTypeChecker();
  switch (node.type) {
    case AST_NODE_TYPES.ImportNamespaceSpecifier:
    case AST_NODE_TYPES.ImportSpecifier:
    case AST_NODE_TYPES.ImportDefaultSpecifier: {
      const type = checker.getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node.local));
      if (type?.symbol) {
        if (type.symbol.declarations?.length > 1) {
          throw new Error('Multiple declarations found for symbol');
        }
        const declaration = type.symbol.declarations?.[0];
        if (declaration) {
        }
        const filename = type.symbol.declarations?.[0]?.getSourceFile()?.fileName;
        const { members, valueDeclaration } = type.symbol;
        if (valueDeclaration) {
          handleValueDeclaration(valueDeclaration);
        } else if (members) {
          //members.forEach(handleValueDeclaration);
        }
        console.log(filename);
      }
    }
  }
  return { instructions };
}

function handleValueDeclaration(value: Declaration) {
  switch (value.kind) {
    case SyntaxKind.MethodSignature:
    case SyntaxKind.MethodDeclaration: {
      break;
    }
  }
}
