import { unify } from "../../machine/sigma";
import { blockCurrentThread } from "../../machine/threads";
import {
  failureException,
  raiseSystemException,
} from "../../machine/exceptions";
import { valueName } from "../../machine/values";
import { evaluate } from "../../evaluation";

export default function(state, semanticStatement, activeThreadIndex) {
  const sigma = state.get("sigma");
  const statement = semanticStatement.get("statement");
  const environment = semanticStatement.get("environment");

  const evaluation = evaluate(statement.get("name"), environment, sigma);

  if (evaluation.get("waitCondition")) {
    return blockCurrentThread(
      state,
      semanticStatement,
      activeThreadIndex,
      evaluation.get("waitCondition"),
    );
  }

  try {
    const unifiedSigma = unify(sigma, evaluation, valueName());

    return state.set("sigma", unifiedSigma);
  } catch (error) {
    return raiseSystemException(state, activeThreadIndex, failureException());
  }
}
