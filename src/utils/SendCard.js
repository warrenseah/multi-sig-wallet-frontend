import React from "react";
import { Button, Container, Form, InputGroup } from "react-bootstrap";
import Card from "react-bootstrap/Card";

const SendCard = () => {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>Send</Card.Title>
        <Container className="send-coins-div">
          <Form.Select aria-label="Default select example">
            <option>Select Token</option>
            <option value="2650">Ethereum</option>
            <option value="26.50">Solana</option>
            <option value="4.65">Filecoin</option>
          </Form.Select>
          <InputGroup className=" send-input" size="lg">
            <Form.Control placeholder="Enter Amount" aria-label="Enter Amount (to the nearest dollar)" />
          </InputGroup>
        </Container>
        <Container className=" send-recipient-div">
        <InputGroup size="lg">
            <Form.Control className=" send-recipient-input" placeholder="Enter Recipient Address" aria-label="Enter Recipient Address" />
          </InputGroup>
        </Container>
        <Container className="buy-btn-div">
          <Button className="buy-btn" variant="primary">
            Send
          </Button>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default SendCard;
