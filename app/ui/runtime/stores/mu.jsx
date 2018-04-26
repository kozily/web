import React from "react";
import { Menu, Table } from "semantic-ui-react";
import Variable from "../variable";

export const RuntimeStoresMu = props => {
  return (
    <div>
      <Menu borderless attached="top" size="tiny">
        <Menu.Item header content={"Mutable (\u03bc)"} />
      </Menu>
      <Table attached selectable compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Variable</Table.HeaderCell>
            <Table.HeaderCell>Value</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {props.store.map((mapping, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                {mapping.getIn(["mutableVariable", "kind"])}
                <sub>{mapping.getIn(["mutableVariable", "sequence"])}</sub>
              </Table.Cell>
              <Table.Cell>
                <Variable variable={mapping.get("immutableVariable")} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default RuntimeStoresMu;
