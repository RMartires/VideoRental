import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Navbar, Nav, Spinner } from "react-bootstrap";
import CoustomTable from "../components/CoustomTable";
import UserTable from "../components/UserTable";
import links from "../link";
var link = links.link();

export default class AdminInterface extends Component {
  state = { list: [], type: "video", loading: true };

  componentDidMount() {
    this.updatelist("video");
  }

  updatelist(type) {
    this.setState({ loading: true });
    fetch(link + `/${type}`)
      .then((res) => {
        return res.json();
      })
      .then((resdata) => {
        this.setState({ list: resdata, type: type, loading: false });
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
        {this.state.loading ? (
          <Spinner animation="border" role="status"></Spinner>
        ) : (
          <Container fluid>
            <Row style={{ marginTop: "30px" }}>
              <Col>{changeTable()}</Col>
            </Row>
          </Container>
        )}
      </div>
    );
  }
}
