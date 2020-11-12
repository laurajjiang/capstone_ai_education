import React from "react";
import {
    Anchor,
    Box,
    Grommet,
    Footer,
    Nav,
    Menu,
    ResponsiveContext,
  } from "grommet";
  import theme from "./theme";
  
const items = [
    { label: "Github Repo", href: "https://github.com/laurajjiang/capstone_ai_education" }
];

const CollapsableFooter = () => (
    <Grommet theme={theme}>
      <Footer
        background="#FFFFFF"
        pad="small"
        border={{ side: "top", size: "small", color: "#000000" }}
      >
        <Box direction="row" align="center" gap="small">
          <Anchor
            margin={{ left : "medium", right : "medium" }}
            color="dark-2"
            size="small"
            label={"Advisor: Dr. Minsuk Kahng"}
          />
        </Box>
        <Box direction="row" align="center" gap="small">
          <Anchor
            margin={{ left : "medium", right : "medium" }}
            color="dark-2"
            size="small"
            label={"Written by Group 21 : Laura Jiang, Thuy-Vy Nguyen, Owen Taylor Markley, Junhyeok Jeong"}
          />
        </Box>
        <Box direction="row" align="center" gap="small">
          <Anchor
            margin={{ left : "medium", right : "medium" }}
            color="dark-2"
            size="small"
            label={"Oregon State University, Corvaills, OR, USA"}
          />
        </Box>
        
        <ResponsiveContext.Consumer>
          {(responsive) =>
            responsive === "small" ? (
              <Menu
                label="Navigate"
                items={[
                  {
                    label: "Github Repo",
                    onClick: (event) => {
                      window.location.href = "https://github.com/laurajjiang/capstone_ai_education";
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
                    size="medium"
                    href={item.href}
                    label={item.label}
                    key={item.label}
                  />
                ))}
              </Nav>
            )
          }
        </ResponsiveContext.Consumer>
      </Footer>
    </Grommet>
  );
  
  export default function SimpleFooter() {
    return <CollapsableFooter />;
  }