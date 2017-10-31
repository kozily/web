// import Immutable from "immutable";
// import { skipStatement, valueCreationStatement } from "../samples/statements";
// import {
//   lexicalVariable,
//   lexicalNumber,
//   lexicalRecord,
// } from "../samples/lexical";
// import {
//   buildState,
//   buildStack,
//   buildSemanticStatement,
//   buildStore,
//   buildEquivalenceClass,
//   buildVariable,
//   buildEnvironment,
// } from "../../app/oz/machine/build";
// import reduce from "../../app/oz/reducers/binding";

// describe("Reducing X=VALUE statements", () => {
//   beforeEach(() => {
//     jasmine.addCustomEqualityTester(Immutable.is);
//   });

//   describe("when value is a number", () => {
//     describe("when variable is unbound", () => {
//       const state = buildState(
//         buildStack(buildSemanticStatement(skipStatement())),
//         buildStore(
//           buildEquivalenceClass(
//             undefined,
//             buildVariable("x", 0),
//             buildVariable("x", 1),
//           ),
//           buildEquivalenceClass(
//             undefined,
//             buildVariable("y", 0),
//             buildVariable("y", 1),
//           ),
//         ),
//       );

//       const statement = buildSemanticStatement(
//         valueCreationStatement(lexicalVariable("X"), lexicalNumber(155)),
//         buildEnvironment({
//           X: buildVariable("x", 0),
//         }),
//       );

//       expect(reduce(state, statement)).toEqual(
//         buildState(
//           buildStack(buildSemanticStatement(skipStatement())),
//           buildStore(
//             buildEquivalenceClass(
//               lexicalNumber(155),
//               buildVariable("x", 0),
//               buildVariable("x", 1),
//             ),
//             buildEquivalenceClass(
//               undefined,
//               buildVariable("z", 0),
//               buildVariable("z", 1),
//             ),
//           ),
//         ),
//       );
//     });

//     describe("when variable is bound to the same value", () => {});

//     describe("when variable is bound to a different value", () => {});
//   });

//   describe("when value is a record", () => {
//     describe("when variable is bound to a compatible value", () => {});

//     describe("when variable is bound to an incompatible value", () => {});
//   });
// });
