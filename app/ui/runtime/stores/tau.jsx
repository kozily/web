import React from "react";
import { Menu, Table } from "semantic-ui-react";
import Variable from "../variable";

export const RuntimeStoresTau = props => {
  return (
    <div>
      <Menu borderless attached="top" size="tiny">
        <Menu.Item header content={"Triggers (\u03c4)"} />
      </Menu>
      <Table attached selectable compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Variable</Table.HeaderCell>
            <Table.HeaderCell>Procedure</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {props.store.map((trigger, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <Variable variable={trigger.get("neededVariable")} />
              </Table.Cell>
              <Table.Cell>
                <Variable variable={trigger.get("procedure")} />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default RuntimeStoresTau;
