import { exceptionRaiseStatement } from "../../app/oz/machine/statements";
import {
  buildSemanticStatement,
  buildEquivalenceClass,
  buildVariable,
  buildEnvironment,
  argumentIndex,
} from "../../app/oz/machine/build";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";

export const buildSystemExceptionState = (
  state,
  activeThreadIndex,
  exception,
) => {
  const aux = lexicalIdentifier(`__${argumentIndex - 1}__`);
  const auxIdentifier = aux.get("identifier");
  return state
    .updateIn(["threads", activeThreadIndex, "stack"], stack =>
      stack.push(
        buildSemanticStatement(
          exceptionRaiseStatement(aux),
          buildEnvironment({
            [auxIdentifier]: buildVariable(auxIdentifier, 0),
          }),
        ),
      ),
    )
    .update("sigma", sigma =>
      sigma.add(
        buildEquivalenceClass(exception, buildVariable(auxIdentifier, 0)),
      ),
    );
};
