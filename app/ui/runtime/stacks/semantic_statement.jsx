import React from "react";
import { Popup, Menu, Header } from "semantic-ui-react";
import { print } from "../../../oz/print";
import Code from "../code";
import Environment from "./environment";

export const RuntimeStacksSemanticStatement = props => {
  const statement = props.semanticStatement.get("statement");
  const printedStatement = print(statement);
  const environment = props.semanticStatement.get("environment");

  const item = (
    <Menu.Item active={props.active} content={printedStatement.abbreviated} />
  );

  return (
    <Popup wide hoverable trigger={item}>
      <Header textAlign="center" size="tiny" content="Statement" />
      <Code>{printedStatement.full}</Code>
      <Header textAlign="center" size="tiny" content="Environment" />
      <Environment environment={environment} />
    </Popup>
  );
};

export default RuntimeStacksSemanticStatement;
