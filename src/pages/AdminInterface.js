import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Navbar, Nav } from "react-bootstrap";
import CoustomTable from "../components/CoustomTable";
import UserTable from "../components/UserTable";

export default class AdminInterface extends Component {
  state = { list: [], type: "video" };

  componentDidMount() {
    this.updatelist("video");
  }

  updatelist(type) {
    fetch("http://localhost:1337/" + type)
      .then((res) => {
        return res.json();
      })
      .then((resdata) => {
        this.setState({ list: resdata, type: type });
      });
  }

  render() {
    const changeTable = () => {
      if (this.state.type === "video") {
        return (
          <CoustomTable
            list={this.state.list}
            updatelist={this.updatelist.bind(this)}
          />
        );
      } else {
        return <UserTable users={this.state.list} />;
      }
    };

    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand
            onClick={() => {
              this.updatelist("video");
            }}
          >
            BlockB
          </Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link
              onClick={() => {
                this.updatelist("video");
              }}
            >
              library
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                this.updatelist("user");
              }}
            >
              users
            </Nav.Link>
          </Nav>
        </Navbar>
        <Container fluid>
          <Row style={{ marginTop: "30px" }}>
            <Col>{changeTable()}</Col>
          </Row>
        </Container>
      </div>
    );
  }
}
