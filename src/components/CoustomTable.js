import React, { useState } from "react";
import { Table } from "react-bootstrap";
import MovieModal from "./MovieModal";

export default function CoustomTable(props) {
  const [show, setShow] = useState(false);
  const [item, setItem] = useState({});

  var body = props.list.map((item) => {
    return (
      <tr
        onClick={() => {
          setItem(item);
          setShow(true);
        }}
      >
        <td>{item.title}</td>
        <td>{item.type}</td>
        <td>{item.stock}</td>
      </tr>
    );
  });

  return (
    <Table borderless={false} hover responsive variant="dark">
      <thead>
        <tr>
          <th>Title</th>
          <th>Type</th>
          <th>Stock</th>
        </tr>
      </thead>
      <tbody>{body}</tbody>
      <MovieModal
        show={show}
        item={item}
        setItem={setItem}
        setShow={setShow}
        updatelist={props.updatelist}
      />
    </Table>
  );
}
