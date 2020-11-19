import React from "react";
import {
  Anchor,
  Box,
  Grommet,
  Header,
  Nav,
  Menu,
  ResponsiveContext,
} from "grommet";
import theme from "./theme";

const items = [
  { label: "About", href: "/about" },
  { label: "Chapter 1", href: "/chapter1"}
];

const CollapsableNav = () => (
  <Grommet theme={theme}>
    <Header
      background="#FFFFFF"
      pad="small"
      border={{ side: "bottom", size: "small", color: "#000000" }}
    >
      <Box direction="row" align="center" gap="small">
        <Anchor
          margin={{ left: "medium" }}
          color="dark-2"
          size="xxlarge"
          href={"/"}
          label={"Interactive Visualization for AI Education"}
          key={"home"}
        />
      </Box>
      <ResponsiveContext.Consumer>
        {(responsive) =>
          responsive === "small" ? (
            <Menu
              label="Navigate"
              items={[
                {
                  label: "About",
                  onClick: (event) => {
                    window.location.href = "/about";
                  },
                },
                {
                  label: "Chapter 1",
                  onClick: (event) => {
                    window.location.href = "/chapter1";
                  },
                }
              ]}
            />
          ) : (
            <Nav direction="row">
              {items.map((item) => (
                <Anchor
                  margin={{ left: "small", right: "medium" }}
                  color="dark-2"
                  size="large"
                  href={item.href}
                  label={item.label}
                  key={item.label}
                />
              ))}
            </Nav>
          )
        }
      </ResponsiveContext.Consumer>
    </Header>
  </Grommet>
);

export default function Navigation() {
  return <CollapsableNav />;
}