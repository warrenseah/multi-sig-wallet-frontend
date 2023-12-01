import React from "react";
import {
  Button,
  Container,
  Form,
  InputGroup,
} from "react-bootstrap";
import Card from "react-bootstrap/Card";

const BuyCard = () => {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>Buy</Card.Title>
        {/* <Card.Subtitle className="mb-2 text-muted">Card Subtitle</Card.Subtitle> */}
        <InputGroup className="mb-3 currency-input" size="lg">
          <InputGroup.Text>$</InputGroup.Text>
          <Form.Control placeholder="0.0" aria-label="Amount (to the nearest dollar)" />
        </InputGroup>
        <Container className="coins-div">
          <Container className="coin-name">Ethereum</Container>
          <Container className="coin-price">$2650</Container>
        </Container>
        <Container className="coins-div">
          <Container className="coin-name">Solana</Container>
          <Container className="coin-price">$26.50</Container>
        </Container>
        <Container className="coins-div">
          <Container className="coin-name">Filecoin</Container>
          <Container className="coin-price">$4.65</Container>
        </Container>
        <Container className="buy-btn-div">
          <Button className="buy-btn" variant="primary">
            Buy
          </Button>
        </Container>
      </Card.Body>
    </Card>
  );
};
export default BuyCard;
