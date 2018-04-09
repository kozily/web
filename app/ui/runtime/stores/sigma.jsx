import React from "react";
import { Menu, Table, Popup } from "semantic-ui-react";
import EquivalenceClass from "./equivalence_class";
import { print } from "../../../oz/print";

export const RuntimeStoreValue = ({ value }) => {
  if (value) {
    const printedValue = print(value);
    const contents = <pre>{printedValue.abbreviated}</pre>;
    return (
      <Popup wide hoverable trigger={contents}>
        <pre>{printedValue.full}</pre>
      </Popup>
    );
  }

  return <span>Unbound</span>;
};

export const RuntimeStoresSigma = props => {
  return (
    <div>
      <Menu borderless attached="top" size="tiny">
        <Menu.Item header content={props.title} />
      </Menu>
      <Table attached selectable compact>
        <Table.Body>
          {props.store.map((equivalenceClass, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <EquivalenceClass equivalenceClass={equivalenceClass} />
              </Table.Cell>
              <Table.Cell>
                <RuntimeStoreValue value={equivalenceClass.get("value")} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default RuntimeStoresSigma;
