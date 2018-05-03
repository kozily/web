import { lexicalIdentifier } from "../../../../app/oz/machine/lexical";
import {
  literalExpression,
  identifierExpression as realIdentifierExpression,
} from "../../../../app/oz/machine/expressions";
import {
  literalFunction,
  literalProcedure,
  literalNumber,
  literalRecord,
  literalAtom,
  literalBoolean,
  literalList,
  literalListItem,
  literalTuple,
  literalString,
} from "../../../../app/oz/machine/literals";

export const identifierExpression = (...args) =>
  realIdentifierExpression(lexicalIdentifier(...args));

export const functionExpression = (...args) =>
  literalExpression(literalFunction(...args));

export const procedureExpression = (...args) =>
  literalExpression(literalProcedure(...args));

export const numberExpression = (...args) =>
  literalExpression(literalNumber(...args));

export const recordExpression = (...args) =>
  literalExpression(literalRecord(...args));

export const atomExpression = (...args) =>
  literalExpression(literalAtom(...args));

export const booleanExpression = (...args) =>
  literalExpression(literalBoolean(...args));

export const listExpression = (...args) =>
  literalExpression(literalList(...args));

export const listItemExpression = (...args) =>
  literalExpression(literalListItem(...args));

export const tupleExpression = (...args) =>
  literalExpression(literalTuple(...args));

export const stringExpression = (...args) =>
  literalExpression(literalString(...args));
