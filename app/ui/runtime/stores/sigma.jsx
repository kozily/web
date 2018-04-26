import React from "react";
import { Menu, Table, Popup, Dropdown } from "semantic-ui-react";
import EquivalenceClass from "./equivalence_class";
import Code from "../code";
import { print } from "../../../oz/print";

export const RuntimeStoreRow = props => {
  const value = props.equivalenceClass.get("value");
  const printedValue = print(value);

  return (
    <Popup
      wide
      hoverable
      trigger={
        <Table.Row>
          <Table.Cell>
            <EquivalenceClass {...props} />
          </Table.Cell>
          <Table.Cell>
            <Code>{printedValue.abbreviated}</Code>
          </Table.Cell>
        </Table.Row>
      }
    >
      <pre>{printedValue.full}</pre>
    </Popup>
  );
};

export const RuntimeStoresSigma = props => {
  const showHide = props.showSystemVariables ? "Hide" : "Show";
  const showHideMessage = `${showHide} system variables`;
  const equivalenceClasses = props.showSystemVariables
    ? props.store
    : props.store.filter(ec => ec.get("variables").some(v => !v.get("system")));
  const orderedEquivalenceClasses = equivalenceClasses.reverse();

  return (
    <div>
      <Menu borderless attached="top" size="tiny">
        <Menu.Item header content={"Immutable (\u03c3)"} />
        <Menu.Menu position="right">
          <Dropdown item icon="ellipsis vertical">
            <Dropdown.Menu>
              <Dropdown.Item
                content={showHideMessage}
                onClick={props.onToggleShowSystemVariables}
              />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Menu>
      <Table attached selectable compact>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Variables</Table.HeaderCell>
            <Table.HeaderCell>Value</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {orderedEquivalenceClasses.map((equivalenceClass, index) => (
            <RuntimeStoreRow
              key={index}
              equivalenceClass={equivalenceClass}
              showSystemVariables={props.showSystemVariables}
            />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default RuntimeStoresSigma;
