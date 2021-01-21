import React from "react";
import TeamIcon from "./teamIcon";
import Spacer from "./spacer";

const derekContent = <>Derek Jeong</>;
const lauraContent = <>Laura Jiang</>;
const owenContent = <>Owen Markley</>;
const thuyvyContent = <>Thuy-Vy Nguyen</>;

export default function Footer() {
  return (
    <>
      <Spacer space={"0.2vh"} />
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}>
        <div>
          <img src='/logo.png' alt='logo' width='20%' />
          <div class='.bp3-text-muted'>
            Capstone (CS461) - Group 21 <br></br> Oregon State University
          </div>
        </div>

        <div class='.bp3-text-muted' style={{ maxWidth: "50%" }}>
          This project is originally created as part of Oregon State
          University's capstone series as part of the graduation requirement for
          computer science students. The project was developed in collaboration
          with project partner,
          <a href='https://minsuk.com/'> Dr. Minsuk Kahng</a>. The tool will
          enable users to actively learn about AI and ML concepts on their web
          browsers with or without programming.
          <Spacer space={"0.2vh"} />
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}>
            Built with love by:{" "}
            <TeamIcon
              content={derekContent}
              src={"teampics/derek.png"}
              alt={"Derek"}
            />
            <TeamIcon
              content={lauraContent}
              src={"teampics/laura.png"}
              alt={"Laura"}
            />
            <TeamIcon
              content={owenContent}
              src={"teampics/owen.png"}
              alt={"Owen"}
            />
            <TeamIcon
              content={thuyvyContent}
              src={"teampics/thuyvy.png"}
              alt={"Thuy-Vy"}
            />
          </div>
        </div>
      </div>
    </>
  );
}
