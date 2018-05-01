import Immutable from "immutable";
import { literalExpression } from "../../app/oz/machine/expressions";
import { lexicalIdentifier } from "../../app/oz/machine/lexical";
import {
  literalAtom,
  literalNumber,
  literalRecord,
} from "../../app/oz/machine/literals";
import {
  valueAtom,
  valueRecord,
  valueNumber,
} from "../../app/oz/machine/values";
import {
  buildSigma,
  buildEquivalenceClass,
  buildVariable,
  buildEnvironment,
  getLastAuxiliaryIdentifier,
} from "../../app/oz/machine/build";
import { evaluate } from "../../app/oz/evaluation";
import { patternMatch } from "../../app/oz/pattern_match";

describe("Pattern matching against a generic record", () => {
  beforeEach(() => {
    jasmine.addCustomEqualityTester(Immutable.is);
  });

  it("matches with no additional bindings when the records don't have any identifiers", () => {
    const sigma = buildSigma(
      buildEquivalenceClass(valueAtom("male"), buildVariable("g", 0)),
    );
    const environment = buildEnvironment({
      G: buildVariable("g", 0),
    });

    const evaluation = evaluate(
      literalExpression(
        literalRecord("person", {
          age: literalNumber(10),
          gender: lexicalIdentifier("G"),
        }),
      ),
      environment,
      sigma,
    );

    const pattern = literalRecord("person", {
      age: literalNumber(10),
      gender: literalAtom("male"),
    });

    const result = patternMatch(evaluation, pattern, sigma);

    expect(result.match).toEqual(true);
    expect(result.additionalBindings).toEqual(buildEnvironment());
    expect(result.sigma).toEqual(sigma);
  });

  it("matches with additional bindings when the records have identifiers", () => {
    const sigma = buildSigma(
      buildEquivalenceClass(valueAtom("male"), buildVariable("g", 0)),
      buildEquivalenceClass(
        valueRecord("address", {
          number: valueNumber(172),
          floor: buildVariable("f", 0),
        }),
        buildVariable("address", 0),
      ),
      buildEquivalenceClass(valueNumber(5), buildVariable("f", 0)),
    );
    const environment = buildEnvironment({
      G: buildVariable("g", 0),
      Address: buildVariable("address", 0),
    });

    const evaluation = evaluate(
      literalExpression(
        literalRecord("person", {
          age: literalNumber(10),
          gender: lexicalIdentifier("G"),
          address: lexicalIdentifier("Address"),
        }),
      ),
      environment,
      sigma,
    );

    const pattern = literalRecord("person", {
      age: lexicalIdentifier("A"),
      gender: literalAtom("male"),
      address: literalRecord("address", {
        number: literalNumber(172),
        floor: lexicalIdentifier("F"),
      }),
    });

    const result = patternMatch(evaluation, pattern, sigma);

    expect(result.match).toEqual(true);
    expect(result.additionalBindings).toEqual(
      buildEnvironment({
        A: buildVariable(
          getLastAuxiliaryIdentifier("patternMatch").get("identifier"),
          0,
        ),
        F: buildVariable("f", 0),
      }),
    );
    expect(result.sigma).toEqual(
      buildSigma(
        buildEquivalenceClass(valueAtom("male"), buildVariable("g", 0)),
        buildEquivalenceClass(
          valueRecord("address", {
            number: valueNumber(172),
            floor: buildVariable("f", 0),
          }),
          buildVariable("address", 0),
        ),
        buildEquivalenceClass(valueNumber(5), buildVariable("f", 0)),
        buildEquivalenceClass(
          valueNumber(10),
          buildVariable(
            getLastAuxiliaryIdentifier("patternMatch").get("identifier"),
            0,
          ),
        ),
      ),
    );
  });

  it("does not match when the types are different", () => {
    const sigma = buildSigma();
    const environment = buildEnvironment();

    const evaluation = evaluate(
      literalExpression(literalNumber(10)),
      environment,
      sigma,
    );

    const pattern = literalRecord("person", { age: literalNumber(10) });

    const result = patternMatch(evaluation, pattern, sigma);

    expect(result.match).toEqual(false);
    expect(result.additionalBindings).toEqual(undefined);
    expect(result.sigma).toEqual(undefined);
  });

  it("does not match when the labels are different", () => {
    const sigma = buildSigma();
    const environment = buildEnvironment();

    const evaluation = evaluate(
      literalExpression(
        literalRecord("person", {
          age: literalNumber(15),
        }),
      ),
      environment,
      sigma,
    );

    const pattern = literalRecord("dog", { age: literalNumber(15) });

    const result = patternMatch(evaluation, pattern, sigma);

    expect(result.match).toEqual(false);
    expect(result.additionalBindings).toEqual(undefined);
    expect(result.sigma).toEqual(undefined);
  });

  it("does not match when the features are different", () => {
    const sigma = buildSigma();
    const environment = buildEnvironment();

    const evaluation = evaluate(
      literalExpression(
        literalRecord("person", {
          age: literalNumber(15),
        }),
      ),
      environment,
      sigma,
    );

    const pattern = literalRecord("person", { weight: literalNumber(15) });

    const result = patternMatch(evaluation, pattern, sigma);

    expect(result.match).toEqual(false);
    expect(result.additionalBindings).toEqual(undefined);
    expect(result.sigma).toEqual(undefined);
  });

  it("does not match when a nested literal is different", () => {
    const sigma = buildSigma(
      buildEquivalenceClass(
        valueRecord("address", {
          number: valueNumber(172),
          floor: valueNumber(5),
        }),
        buildVariable("a", 0),
      ),
    );
    const environment = buildEnvironment({
      Address: buildVariable("a", 0),
    });

    const evaluation = evaluate(
      literalExpression(
        literalRecord("person", {
          age: literalNumber(15),
          address: lexicalIdentifier("Address"),
        }),
      ),
      environment,
      sigma,
    );

    const pattern = literalRecord("person", {
      age: literalNumber(15),
      address: literalRecord("address", {
        number: lexicalIdentifier("N"),
        floor: literalNumber(10),
      }),
    });

    const result = patternMatch(evaluation, pattern, sigma);

    expect(result.match).toEqual(false);
    expect(result.additionalBindings).toEqual(undefined);
    expect(result.sigma).toEqual(undefined);
  });
});
