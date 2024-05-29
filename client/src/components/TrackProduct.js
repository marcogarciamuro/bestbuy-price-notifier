import React, { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useAuth } from "../contexts/AuthContext";
import ProductForm from "./TrackNewProductModal";
import Container from "react-bootstrap/Container";

function TrackProduct() {
  const { user } = useAuth();

  return (
    <Container>
      {user && <p>{user.uid}</p>}
      <Row className="justify-content-center">
        <Col className="col-sm-12 col-lg-6">
          <ProductForm />
        </Col>
      </Row>
    </Container>
  );
}

export default TrackProduct;
