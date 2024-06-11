import { Block, createBlock } from './block';
import {
  createFunctionDefinitionFromName,
  createNewObjectFunctionDefinition,
  createSetFieldFunctionDefinition,
  FunctionDefinition,
} from './function-definition';
import { createParameter, Parameter } from './values/parameter';
import { createScopeDeclarationInstruction, isTerminated } from './utils';
import { createCallInstruction } from './instructions/call-instruction';
import { createReference } from './values/reference';
import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/typescript-estree';
import { handleStatement } from './statements';
import { createReturnInstruction } from './instructions/return-instruction';
import { createNull } from './values/constant';
import { ScopeManager } from './scope-manager';
import type { Location } from './location';
import { Instruction } from './instruction';
import { createBranchingInstruction } from './instructions/branching-instruction';

export type FunctionInfo = {
  readonly scopeManager: ScopeManager;
  readonly fileName: string;
  readonly blocks: Array<Block>;
  readonly definition: FunctionDefinition;
  readonly parameters: Array<Parameter>;
  readonly functionCalls: Set<string>;

  createBlock(location: Location): Block;
  getCurrentBlock(): Block;
  pushBlock(block: Block): void;
  addInstructions(instructions: Array<Instruction>): void;
  addFunctionCall(callSignature: FunctionDefinition): void;
};

export const createFunctionInfo = <T extends TSESTree.FunctionLike | TSESTree.Program>(
  name: string,
  node: T,
  scopeManager: ScopeManager,
): FunctionInfo => {
  const blocks: Array<Block> = [];
  let blockIndex: number = 0;

  const location = node.loc;
  const definition = createFunctionDefinitionFromName(name, scopeManager.fileName);
  // create the main function block
  const currentScopeId = scopeManager.getScopeId(scopeManager.getScope(node));
  const block = createBlock(blockIndex++, location);
  blocks.push(block);
  // add the scope creation instruction
  block.instructions.push(createScopeDeclarationInstruction(currentScopeId, location));
  const parameters = [];

  if (node.type !== AST_NODE_TYPES.Program) {
    const parentScopeName = '@parent';
    const parentReference = createParameter(
      scopeManager.createValueIdentifier(),
      parentScopeName,
      location,
    );
    parameters.push(parentReference);

    // resolve the function parameters
    const functionParametersName = '@params';
    const functionParametersReference = createParameter(
      scopeManager.createValueIdentifier(),
      functionParametersName,
      location,
    );
    parameters.push(functionParametersReference);

    // add the "set parent" instruction
    block.instructions.push(
      createCallInstruction(
        scopeManager.createValueIdentifier(),
        null,
        createSetFieldFunctionDefinition('@parent'),
        [createReference(currentScopeId), parentReference],
        location,
      ),
    );
  } else {
    setGlobals(scopeManager, block, location, currentScopeId);

    // create the main function block
    const mainBlock = createBlock(blockIndex++, location);
    blocks.push(mainBlock);

    // branch the global block to the main block
    block.instructions.push(createBranchingInstruction(mainBlock, location));

    if (scopeManager.isModule()) {
      const moduleScopeId = 1;
      mainBlock.instructions.push(createScopeDeclarationInstruction(moduleScopeId, location));
      mainBlock.instructions.push(
        createCallInstruction(
          scopeManager.createValueIdentifier(),
          null,
          createSetFieldFunctionDefinition('@parent'),
          [createReference(moduleScopeId), createReference(0)],
          location,
        ),
      );
    }
  }
  const functionCalls: Set<string> = new Set();

  const functionInfo: FunctionInfo = {
    scopeManager,
    fileName: scopeManager.fileName,
    definition,
    blocks,
    parameters,
    functionCalls,
    addFunctionCall: functionDefinition => {
      functionCalls.add(functionDefinition.signature);
    },
    createBlock: location => {
      return createBlock(blockIndex++, location);
    },
    getCurrentBlock() {
      return blocks[blocks.length - 1];
    },
    pushBlock: block => {
      blocks.push(block);
    },
    addInstructions: instructions => {
      blocks[blocks.length - 1].instructions.push(...instructions);
    },
  };

  // handle the body statements
  getBody(node).forEach((statement: TSESTree.Statement) => {
    return handleStatement(statement, functionInfo);
  });

  const lastBlock = blocks[blocks.length - 1];

  if (!isTerminated(lastBlock)) {
    lastBlock.instructions.push(createReturnInstruction(createNull(), location));
  }

  scopeManager.addFunctionInfo(functionInfo);

  return functionInfo;
};

function getBody(node: TSESTree.FunctionLike | TSESTree.Program): TSESTree.ProgramStatement[] {
  switch (node.type) {
    case AST_NODE_TYPES.Program:
      return node.body;
    case AST_NODE_TYPES.FunctionDeclaration:
      return node.body.body;
    case AST_NODE_TYPES.ArrowFunctionExpression:
      if (node.body.type === AST_NODE_TYPES.BlockStatement) {
        return node.body.body;
      } else {
        return [
          {
            type: AST_NODE_TYPES.ExpressionStatement,
            expression: node.body,
            loc: node.loc,
            range: node.range,
            directive: undefined,
            parent: node,
          },
        ];
      }
    default:
      throw new Error(`Type ${node.type} is not yet supported`);
  }
}

function setGlobals(
  scopeManager: ScopeManager,
  block: Block,
  location: TSESTree.SourceLocation,
  scopeId: number,
) {
  // globalThis is a reference to the outer scope itself
  block.instructions.push(
    createCallInstruction(
      scopeManager.createValueIdentifier(),
      null,
      createSetFieldFunctionDefinition('globalThis'),
      [createReference(scopeId), createReference(scopeId)],
      location,
    ),
  );
}

function getFunctionName(
  functionReferenceIdentifier: number,
  identifier: TSESTree.Identifier | null,
  functionInfo: FunctionInfo,
) {
  if (identifier) {
    const { name } = identifier;
    if (functionInfo.definition.name === 'main') {
      return name;
    }
    return `${functionInfo.definition.name}__${name}__${functionReferenceIdentifier}`;
  }
  return `${functionInfo.definition.name}__${functionReferenceIdentifier}`;
}

export function handleFunctionLike(node: TSESTree.FunctionLike, functionInfo: FunctionInfo) {
  const { addInstructions, scopeManager } = functionInfo;
  const { createValueIdentifier } = scopeManager;

  const functionReferenceIdentifier = createValueIdentifier();
  const functionReference = createReference(functionReferenceIdentifier);
  const functionName = getFunctionName(functionReferenceIdentifier, node.id, functionInfo);
  createFunctionInfo(functionName, node, scopeManager);

  // create the function object
  addInstructions([
    createCallInstruction(
      functionReferenceIdentifier,
      null,
      createNewObjectFunctionDefinition(),
      [],
      node.loc,
    ),
  ]);
  if (node.id) {
    const parentScope = functionInfo.scopeManager.getScope(node).upper!;
    const parentScopeId = functionInfo.scopeManager.getScopeId(parentScope);
    addInstructions([
      createCallInstruction(
        createValueIdentifier(),
        null,
        createSetFieldFunctionDefinition(node.id.name),
        [createReference(parentScopeId), functionReference],
        node.loc,
      ),
    ]);
  }
  return functionReference;
}
