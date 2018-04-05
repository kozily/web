import React from "react";
import { List, Input, Header, Segment, Menu, Image } from "semantic-ui-react";
import "./store.css";

export const Store = props => {
  return (
    <div>
      <Header as="h4" textAlign="center">
        {props.name}
      </Header>
      <Menu attached="top" tabular>
        <Menu.Item name="Full" active={props.activeItem === "full"} />
        <Menu.Item name="Diff" active={props.activeItem === "diff"} />
        <Menu.Item position="right">
          <Input
            transparent
            icon={{ name: "search", link: true }}
            placeholder="Key"
          />
        </Menu.Item>
      </Menu>

      <Segment attached="bottom" className="store-taller">
        {props.data == undefined ? (
          <Image
            fluid
            src="https://react.semantic-ui.com/assets/images/wireframe/paragraph.png"
          />
        ) : (
          <List>
            {props.data
              .reduce((acc, item) => acc.concat(item), [])
              .map((x, indx) => (
                <List.Item key={indx}>
                  {x.variables.map(x => x.name + x.sequence)}={x.value ==
                  undefined
                    ? "unbound"
                    : x.value}
                </List.Item>
              ))}
          </List>
        )}
      </Segment>
    </div>
  );
};

export default Store;
