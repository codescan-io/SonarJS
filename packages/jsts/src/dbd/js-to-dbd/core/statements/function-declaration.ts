import type { StatementHandler } from '../statement-handler';
import { TSESTree } from '@typescript-eslint/typescript-estree';
import { createAssignment, createVariable } from '../variable';
import { createFunctionReference } from '../values/function-reference';
import { createCallInstruction } from '../instructions/call-instruction';
import {
  createNewObjectFunctionDefinition,
  createSetFieldFunctionDefinition,
} from '../function-definition';
import { createReference } from '../values/reference';

export const handleFunctionDeclaration: StatementHandler<TSESTree.FunctionDeclarationWithName> = (
  node,
  context,
) => {
  const { id } = node;
  const {
    addInstructions,
    scopeManager,
    functionInfo: currentFunctionInfo,
    processFunctionInfo,
  } = context;
  const { createValueIdentifier, getCurrentScopeIdentifier, addVariable, addAssignment } =
    scopeManager;
  const { name } = id;

  const scopeReference = createReference(getCurrentScopeIdentifier());

  // a function declaration is a variable declaration and an assignment in the current scope
  // todo: should be in the ***passed*** scope?
  const variable = createVariable(name);

  addVariable(variable);

  const functionReferenceIdentifier = createValueIdentifier();
  // todo: we may need a common helper
  let functionName;
  if (currentFunctionInfo.definition.name === 'main') {
    functionName = name;
  } else {
    functionName = `${currentFunctionInfo.definition.name}__${functionReferenceIdentifier}`;
  }
  const functionInfo = processFunctionInfo(
    functionName,
    node.body.body,
    scopeReference,
    node.params,
    node.loc,
  );
  const functionReference = createFunctionReference(functionInfo, functionReferenceIdentifier);

  currentFunctionInfo.functionReferences.push(functionReference);

  // create the function object
  addInstructions([
    createCallInstruction(
      functionReference.identifier,
      null,
      createNewObjectFunctionDefinition(),
      [],
      node.loc,
    ),
    createCallInstruction(
      createValueIdentifier(),
      null,
      createSetFieldFunctionDefinition(variable.name),
      [scopeReference, functionReference],
      node.loc,
    ),
  ]);

  const assignment = createAssignment(functionReference.identifier, variable);

  addAssignment(id.name, assignment);
};
