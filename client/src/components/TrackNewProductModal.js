import Form from "react-bootstrap/Form";
import { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

function TrackNewProductModal(props) {
  const navigate = useNavigate();
  const [selectedSearchOption, setSelectedSearchOption] = useState("url");
  const [productUrl, setProductUrl] = useState("");
  const [productSku, setProductSku] = useState("");
  const [pricePaid, setPricePaid] = useState(0);
  const [validated, setValidated] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState(new Date());
  const { user } = useAuth();

  function handleSearchOptionChange(event) {
    setSelectedSearchOption(event.target.value);
  }

  function handleDateChange(event) {
    const newDate = new Date(event.target.value);
    console.log(newDate);
    setPurchaseDate(newDate);
  }

  function handleProductURLChange(event) {
    setProductUrl(event.target.value);
  }

  async function onTrackNewProductSubmit(e) {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!user) {
      alert("You aren't sneaky! Log in to continue");
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);
    try {
      console.log(purchaseDate.toISOString());
      axios.get("http://localhost:3001/getData", {
        params: {
          productUrl: encodeURIComponent(productUrl),
          userId: user.uid,
          pricePaid: pricePaid,
          purchaseDate: purchaseDate.toISOString(),
        },
      });
    } catch (error) {
      console.error("Error:", error.message);
    } finally {
      props.handleClose();
    }
  }

  let newProductForm = (
    <Form noValidate validated={validated}>
      <Form.Group className="mb-3">
        <Form.Label>Search product by:</Form.Label>
        <Form.Select
          onChange={handleSearchOptionChange}
          value={selectedSearchOption}
        >
          <option value="url">URL</option>
          <option value="sku">SKU</option>
        </Form.Select>
      </Form.Group>
      {selectedSearchOption === "url" ? (
        <Form.Group className="mb-3">
          <Form.Label>Product URL</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter Product URL"
            value={productUrl}
            onChange={handleProductURLChange}
          ></Form.Control>
        </Form.Group>
      ) : (
        <Form.Group className="mb-3">
          <Form.Label>Product SKU</Form.Label>
          <Form.Control
            placeholder="Enter Product SKU"
            value={productSku}
          ></Form.Control>
        </Form.Group>
      )}
      <Form.Group className="mb-3">
        <Form.Label>Price Paid</Form.Label>
        <Form.Control
          required
          type="number"
          placeholder="Amount Paid"
          min="0.99"
          step="1"
          value={pricePaid}
          onChange={(e) => setPricePaid(e.target.value)}
        ></Form.Control>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Purchase Date</Form.Label>
        <Form.Control
          required
          type="date"
          value={purchaseDate.toISOString().split("T")[0]}
          onChange={handleDateChange}
        ></Form.Control>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check
          required
          className="my-3"
          type="checkbox"
          label="I agree to receive emails about price udpates"
        />
      </Form.Group>
    </Form>
  );
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Track New Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>{newProductForm}</Modal.Body>
      <Modal.Footer>
        {purchaseDate.toISOString()}
        <Button variant="secondary" onClick={props.handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={onTrackNewProductSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TrackNewProductModal;
