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
    const featuresMap = Object.keys(builtIns[recordBuiltIn]).reduce(
      (acc, item) => {
        acc[builtIns[recordBuiltIn][item]] = buildVariable(
          builtIns[recordBuiltIn][item].toLowerCase(),
          0,
        );
        return Immutable.fromJS(acc);
      },
      {},
    );
    const environment = recordMap.merge(featuresMap);

    const featuresInsideRecord = Object.keys(builtIns[recordBuiltIn]).reduce(
      (acc, item) => {
        acc[item] = buildVariable(
          builtIns[recordBuiltIn][item].toLowerCase(),
          0,
        );
        return Immutable.fromJS(acc);
      },
      {},
    );
    const sigmaRecordMap = buildEquivalenceClass(
      valueRecord(recordBuiltIn, featuresInsideRecord),
      variableRecord,
    );
    const sigmaFeaturesMap = Object.keys(builtIns[recordBuiltIn])
      .reduce((acc, item) => {
        acc.push({
          value: valueBuiltIn(item, recordBuiltIn),
          variable: buildVariable(
            builtIns[recordBuiltIn][item].toLowerCase(),
            0,
          ),
        });
        return Immutable.fromJS(acc);
      }, [])
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
