import React from "react";
import { Menu, Table, Popup } from "semantic-ui-react";
import EquivalenceClass from "./equivalence_class";
import Code from "../code";
import { print } from "../../../oz/print";

export const RuntimeStoreRow = ({ equivalenceClass }) => {
  const value = equivalenceClass.get("value");

  if (!value) {
    return (
      <Table.Row>
        <Table.Cell>
          <EquivalenceClass equivalenceClass={equivalenceClass} />
        </Table.Cell>
        <Table.Cell>
          <Code>Unbound</Code>
        </Table.Cell>
      </Table.Row>
    );
  }

  const printedValue = print(value);
  const content = (
    <Table.Row>
      <Table.Cell>
        <EquivalenceClass equivalenceClass={equivalenceClass} />
      </Table.Cell>
      <Table.Cell>
        <Code>{printedValue.abbreviated}</Code>
      </Table.Cell>
    </Table.Row>
  );

  return (
    <Popup wide hoverable trigger={content}>
      <pre>{printedValue.full}</pre>
    </Popup>
  );
};

export const RuntimeStoresSigma = props => {
  return (
    <div>
      <Menu borderless attached="top" size="tiny">
        <Menu.Item header content={"Immutable (\u03c3)"} />
      </Menu>
      <Table attached selectable compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Variable</Table.HeaderCell>
            <Table.HeaderCell>Value</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {props.store.map((equivalenceClass, index) => (
            <RuntimeStoreRow key={index} equivalenceClass={equivalenceClass} />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default RuntimeStoresSigma;
