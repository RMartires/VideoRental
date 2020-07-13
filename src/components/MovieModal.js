import React, { useState, useRef } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { Dropdown, Overlay, Tooltip, Toast } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";

export default function MovieModal(props) {
  const [showSaved, setShowSaved] = useState(false);
  const [days, setDays] = useState(1);
  const [customerId, setCustomerId] = useState(undefined);
  const [error, setError] = useState("");
  const [rented, setRented] = useState(false);
  const [bp, setBp] = useState(undefined);
  const [usebp, setUsebp] = useState(false);
  const target = useRef(null);

  const handleClose = () => {
    setCustomerId(undefined);
    setUsebp(false);
    setBp(undefined);
    props.setShow(false);
    setError("");
    setDays(1);
  };
  //const handleShow = () => setShow(true);

  const changetype = (newtype, id) => {
    console.log(newtype);
    axios({
      url: "http://localhost:1337/video/" + id,
      method: "PATCH",
      data: { type: newtype },
    })
      .then((resdata) => {
        props.setItem(resdata.data);
        setShowSaved(true);
        setTimeout(() => {
          setShowSaved(false);
        }, 800);
        props.updatelist("video");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function showRented() {
    props.setShow(false);
    setRented(true);
    setTimeout(() => {
      setRented(false);
    }, 1500);
  }

  function getdate(days) {
    var x = new Date();
    x.setDate(x.getDate() + days);
    return x;
  }

  function getcurrentbp(bp) {
    if (!usebp) {
      return bp;
    } else {
      return bp - 25;
    }
  }

  async function Rent() {
    try {
      if (!usebp) {
        var res = await axios({
          url: "http://localhost:1337/user/updatebp/",
          method: "PATCH",
          data: {
            userId: customerId,
            movieType: props.item.type,
          },
        });
      } else {
        var res = await axios({
          url: "http://localhost:1337/user/" + customerId,
          method: "PATCH",
          data: {
            bonusPoints: getcurrentbp(bp),
          },
        });
      }
      var res = await axios({
        url: "http://localhost:1337/myrentals/",
        method: "POST",
        data: {
          owner: customerId,
          myrental: props.item.id,
          issueed: getdate(0),
          expiry: getdate(days),
          price: getprice(days, props.item.type),
          paid: usebp ? 0 : getprice(days, props.item.type),
          title: props.item.title,
        },
      });

      showRented();
    } catch (err) {
      setError("Coustomer does not exist");
    }
  }

  return (
    <div>
      <Modal show={props.show} onHide={handleClose} centered>
        <Modal.Header
          closeButton
          style={{
            backgroundColor: "#0E0E0E",
            textAlign: "center",
            color: "white",
          }}
        >
          <h2>{props.item.title}</h2>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#0E0E0E", textAlign: "center" }}>
          <Container>
            <Row>
              <Col xs={12} sm={6}>
                <img
                  style={{ width: "100%" }}
                  src={props.item.poster}
                  alt={props.item.title}
                ></img>
              </Col>
              <Col style={{ color: "white" }} xs={12} sm={6}>
                <p style={{ textAlign: "left" }}>{props.item.plot}</p>
                <div style={{ display: "flex", marginBottom: "20px" }}>
                  <h6
                    style={{ textAlign: "left", marginRight: "5px" }}
                    ref={target}
                  >
                    {"Type: " + props.item.type}
                  </h6>
                  <Overlay
                    target={target.current}
                    show={showSaved}
                    placement="top"
                  >
                    {(props) => (
                      <Tooltip id="overlay-example" {...props}>
                        Saved
                      </Tooltip>
                    )}
                  </Overlay>
                  <Dropdown>
                    <Dropdown.Toggle
                      as={CustomToggle}
                      id="dropdown-custom-components"
                    ></Dropdown.Toggle>

                    <Dropdown.Menu as={CustomMenu}>
                      <Dropdown.Item
                        onClick={() => {
                          changetype("New", props.item.id);
                        }}
                      >
                        New
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          changetype("Old", props.item.id);
                        }}
                      >
                        Old
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          changetype("Regular", props.item.id);
                        }}
                      >
                        Regular
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

                <Form.Control
                  type="text"
                  style={{ marginBottom: "10px" }}
                  placeholder="Enter CustomerId"
                  onChange={(e) => {
                    var id = e.target.value;
                    setCustomerId(id);
                    fetch("http://localhost:1337/user/" + id)
                      .then((res) => {
                        return res.json();
                      })
                      .then((resdata) => {
                        setError("");
                        setBp(resdata.bonusPoints);
                      })
                      .catch((err) => {
                        setBp(undefined);
                        setError("Coustomer not found");
                      });
                  }}
                  value={customerId}
                />
                <p style={{ color: "red" }}>{error}</p>
                <Form style={{ display: "flex" }}>
                  <Form.Control
                    type="number"
                    style={{ width: "60px" }}
                    onChange={(e) => {
                      if (e.target.value > 99 || e.target.value < 1) {
                        setDays(1);
                      } else {
                        setDays(e.target.value);
                      }
                    }}
                    value={days}
                  />
                  <p
                    style={{
                      marginTop: "auto",
                      marginBottom: "auto",
                      marginLeft: "5px",
                    }}
                  >
                    Days
                  </p>
                </Form>
                {bp >= 25 ? (
                  <div style={{ display: "flex", marginTop: "10px" }}>
                    <input
                      type="checkbox"
                      style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                        backgroundColor: "black",
                        borderColor: "black",
                      }}
                      onClick={() => {
                        setUsebp(!usebp);
                      }}
                      aria-label="Checkbox for following text input"
                    ></input>
                    <p
                      style={{
                        marginTop: "auto",
                        marginBottom: "auto",
                        marginLeft: "2px",
                      }}
                    >
                      use bonus points to pay current: {getcurrentbp(bp)}
                    </p>
                  </div>
                ) : (
                  ""
                )}
                <Button
                  variant="success"
                  style={{ marginTop: "50px" }}
                  onClick={Rent}
                >
                  Rent {usebp ? 0 : getprice(days, props.item.type)}$
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
      <Toast
        show={rented}
        style={{
          position: "fixed",
          bottom: "10px",
          right: "10px",
          backgroundColor: "black",
        }}
      >
        <Toast.Body>Rented 🙌</Toast.Body>
      </Toast>
    </div>
  );
}

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    // eslint-disable-next-line
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
    &#x25bc;
  </a>
));

// forwardRef again here!
// Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
  ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
    const [value, setValue] = useState("");

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) =>
              !value || child.props.children.toLowerCase().startsWith(value)
          )}
        </ul>
      </div>
    );
  }
);

function getprice(days, type) {
  var premium_fee = 50;
  var regular_fee = 40;

  if (type === "New") {
    return days * premium_fee;
  } else if (type === "Regular") {
    if (days > 3) {
      return regular_fee + regular_fee * (days - 3);
    } else {
      return regular_fee;
    }
  } else {
    if (days > 5) {
      return regular_fee + regular_fee * (days - 5);
    } else {
      return regular_fee;
    }
  }
}
