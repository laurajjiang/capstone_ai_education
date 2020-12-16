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

const items = [
  { label: "About", href: "/about" },
  { label: "Chapter 1", href: "/chapter1" },
];

// const CollapsableNav = () => (
//   <Grommet theme={theme}>
//     <Header
//       background='#FFFFFF'
//       pad='small'
//       border={{ side: "bottom", size: "small", color: "#000000" }}>
//       <Box direction='row' align='center' gap='small'>
//         <Anchor
//           margin={{ left: "medium" }}
//           color='dark-2'
//           size='xxlarge'
//           href={"/"}
//           label={"Interactive Visualization for AI Education"}
//           key={"home"}
//         />
//       </Box>
//       <ResponsiveContext.Consumer>
//         {(responsive) =>
//           responsive === "small" ? (
//             <Menu
//               label='Navigate'
//               items={[
//                 {
//                   label: "About",
//                   onClick: (event) => {
//                     window.location.href = "/about";
//                   },
//                 },
//                 {
//                   label: "Chapter 1",
//                   onClick: (event) => {
//                     window.location.href = "/chapter1";
//                   },
//                 },
//               ]}
//             />
//           ) : (
//             <Nav direction='row'>
//               {items.map((item) => (
//                 <Anchor
//                   margin={{ left: "small", right: "medium" }}
//                   color='dark-2'
//                   size='large'
//                   href={item.href}
//                   label={item.label}
//                   key={item.label}
//                 />
//               ))}
//             </Nav>
//           )
//         }
//       </ResponsiveContext.Consumer>
//     </Header>
//   </Grommet>
// );

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
                icon='cut'
                text='Chapter 0 - Introduction'
                onClick={(e) => (window.location.href = "/chapter1")}
              />
              <MenuDivider />
              <MenuItem
                icon='new-link'
                text='Chapter 1'
                onClick={(e) => (window.location.href = "/chapter1")}
              />
              <MenuDivider />
              <MenuItem icon='new-link' text='Chapter 2' />
            </Menu>
          }
          position={Position.BOTTOM_RIGHT}>
          <Button className='bp3-minimal' icon='learning' text='Learn' />
        </Popover>
      </Navbar.Group>
    </Navbar>
  );
}
