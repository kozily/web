import Immutable from "immutable";
import {
  buildEnvironment,
  buildVariable,
  buildSigma,
  buildEquivalenceClass,
} from "./build";
import { valueRecord, valueBuiltIn } from "./values";
import { builtIns } from "./builtIns";

export const initialize = () => {
  const builtInMapped = Object.keys(builtIns).reduce((acc, recordBuiltIn) => {
    const variableRecord = buildVariable(recordBuiltIn.toLowerCase(), 0);
    const recordMap = Immutable.fromJS({ [recordBuiltIn]: variableRecord });
    const environment = recordMap;

    const featuresInsideRecord = Object.keys(builtIns[recordBuiltIn]).reduce(
      (acc, item) => {
        return acc.set(
          item,
          buildVariable(builtIns[recordBuiltIn][item].name.toLowerCase(), 0),
        );
      },
      Immutable.Map(),
    );
    const sigmaRecordMap = buildEquivalenceClass(
      valueRecord(recordBuiltIn, featuresInsideRecord),
      variableRecord,
    );
    const sigmaFeaturesMap = Object.keys(builtIns[recordBuiltIn])
      .reduce((acc, item) => {
        return acc.push(
          Immutable.Map({
            value: valueBuiltIn(item, recordBuiltIn),
            variable: buildVariable(
              builtIns[recordBuiltIn][item].name.toLowerCase(),
              0,
            ),
          }),
        );
      }, Immutable.List())
      .map(pair => {
        return buildEquivalenceClass(pair.get("value"), pair.get("variable"));
      });
    const sigma = sigmaFeaturesMap.push(sigmaRecordMap);
    return Immutable.fromJS({ environment, sigma });
  }, {});

  const environment = buildEnvironment(builtInMapped.get("environment"));
  const sigma = buildSigma(...builtInMapped.get("sigma").toArray());
  return Immutable.fromJS({
    environment,
    sigma,
  });
};
