import { Tooltip } from "@blueprintjs/core";

export default function TeamIcon(props) {
  return (
    <Tooltip content={props.content}>
      <img
        src={props.src}
        alt={props.alt}
        style={{ maxWidth: "75px", paddingLeft: "10px" }}
      />
    </Tooltip>
  );
}
