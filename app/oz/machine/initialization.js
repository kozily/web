import Immutable from "immutable";
import {
  buildEnvironment,
  buildVariable,
  buildSigma,
  buildEquivalenceClass,
} from "./build";
import { valueRecord, valueBuiltIn } from "./values";
import { builtIns, allBuiltInTypes } from "./builtIns";

export const initialize = () => {
  const builtInMapped = allBuiltInTypes.reduce((acc, recordBuiltIn) => {
    const variableRecord = buildVariable(recordBuiltIn.toLowerCase(), 0);
    const environment = Immutable.fromJS({ [recordBuiltIn]: variableRecord });

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
    const result = Immutable.fromJS({
      environment: acc.get("environment").merge(environment),
      sigma: acc.get("sigma").concat(sigma),
    });
    return result;
  }, Immutable.Map({ environment: Immutable.Map(), sigma: Immutable.List() }));

  const environment = buildEnvironment(builtInMapped.get("environment"));
  const sigma = buildSigma(...builtInMapped.get("sigma").toArray());
  return Immutable.fromJS({
    environment,
    sigma,
  });
};
