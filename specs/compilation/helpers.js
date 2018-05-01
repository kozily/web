import { identifierExpression } from "../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import { getLastAuxiliaryIdentifier } from "../../app/oz/machine/build";

export const identifier = id => identifierExpression(lexicalIdentifier(id));

export const auxExpressionIdentifier = (...args) =>
  getLastAuxiliaryIdentifier("exp", ...args);

export const auxExpression = (...args) =>
  identifierExpression(getLastAuxiliaryIdentifier("exp", ...args));
