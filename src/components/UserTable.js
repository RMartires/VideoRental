import React, { useState } from "react";
import { Table, Modal } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import links from "../link";
var link = links.link();

export default function UserTable(props) {
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({});
  const [myrentals, setMyrentals] = useState([]);

  const handleClose = () => setShow(false);
  //const handleShow = () => setShow(true);

  const getmyrentals = (id) => {
    fetch(link + "/getmyrentals/?userId=" + id, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((resdata) => {
        setMyrentals(resdata);
      });
  };

  var body = props.users.map((user) => {
    return (
      <tr
        onClick={() => {
          setUser(user);
          setShow(true);
          getmyrentals(user.id);
        }}
      >
        <td>{user.id}</td>
        <td>{user.name}</td>
        <td>{user.bonusPoints}</td>
      </tr>
    );
  });

  return (
    <Table borderless={false} hover responsive variant="dark">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Bonus points</th>
        </tr>
      </thead>
      <tbody>{body}</tbody>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header
          style={{
            backgroundColor: "#0E0E0E",
            color: "white",
            display: "block",
          }}
        >
          <h5>{"Name :" + user.name}</h5>
          <h5>{"ID: " + user.id}</h5>
          <h5>{"Bonus points :" + user.bonusPoints}</h5>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#0E0E0E", textAlign: "center" }}>
          <Container>
            <Row>
              <Col style={{ color: "white", textAlign: "left" }}>
                <h5>Rentals</h5>
                <div>
                  {myrentals.map((item) => {
                    return (
                      <div style={{ display: "bloack" }}>
                        <hr style={{ backgroundColor: "white" }} />
                        <h6>title: {item.title}</h6>
                        <h6>issued: {item.issueed}</h6>
                        <h6>expiry: {item.expiry}</h6>
                        <h6>price: {item.price}$</h6>
                        <h6>paid {item.paid}$</h6>
                      </div>
                    );
                  })}
                </div>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </Table>
  );
}
