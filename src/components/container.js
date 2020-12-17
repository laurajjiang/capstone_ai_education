export default function Container(props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: props.height,
        alignItems: "center",
        marginLeft: "50vh",
        marginRight: "50vh",
      }}>
      {props.content}
    </div>
  );
}
