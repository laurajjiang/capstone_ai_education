import React from "react";
import {
  Alignment,
  Button,
  Navbar,
  Classes,
  Menu,
  MenuDivider,
  MenuItem,
  Popover,
  Position,
} from "@blueprintjs/core";

export default function Navigation() {
  return (
    <Navbar>
      <Navbar.Group>
        <Navbar.Heading>
          Interactive Visualization for AI Education
        </Navbar.Heading>
        <Navbar.Divider />
        <Button
          className='bp3-minimal'
          icon='home'
          text='Home'
          onClick={(e) => (window.location.href = "/")}
        />
        <Button
          className='bp3-minimal'
          icon='id-number'
          text='About'
          onClick={(e) => (window.location.href = "/about")}
        />
      </Navbar.Group>
      <Navbar.Group align={Alignment.RIGHT}>
        <Navbar.Divider />
        <Popover
          content={
            <Menu className={Classes.ELEVATION_1}>
              <MenuItem
                icon='new-link'
                text='Chapter 0 - Introduction'
                onClick={(e) => (window.location.href = "/chapter0")}
              />
              <MenuDivider />
              <MenuItem
                icon='new-link'
                text='Chapter 1 - Sentiment Classification'
                onClick={(e) => (window.location.href = "/chapter1")}
              />
              <MenuDivider />
              <MenuItem
                icon='new-link'
                text='Chapter 2'
                onClick={(e) => (window.location.href = "/chapter2")}
              />
            </Menu>
          }
          position={Position.BOTTOM_RIGHT}>
          <Button className='bp3-minimal' icon='learning' text='Learn' />
        </Popover>
      </Navbar.Group>
    </Navbar>
  );
}
