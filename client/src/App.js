import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState } from "react";
import axios from "axios";

function App() {
  const [selectedSearchOption, setSelectedSearchOption] = useState("url");
  const [productURL, setProductURL] = useState("");
  const [productSKU, setProductSKU] = useState("");
  function handleSearchOptionChange(event) {
    setSelectedSearchOption(event.target.value);
  }

  function handleProductURLChange(event) {
    setProductURL(event.target.value);
  }
  async function getData() {
    try {
      const response = await axios.get(
        `http://localhost:3001/getData?link=${encodeURIComponent(productURL)}`
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error.message);
    }
  }
  return (
    <>
      <h1 className="text-center p-4">Best Buy Price Tracker</h1>
      <Container>
        <Row className="justify-content-center">
          <Col className="col-sm-12 col-lg-6">
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

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
                    type="text"
                    placeholder="Enter Product URL"
                    value={productURL}
                    onChange={handleProductURLChange}
                  ></Form.Control>
                </Form.Group>
              ) : (
                <Form.Group className="mb-3">
                  <Form.Label>Product SKU</Form.Label>
                  <Form.Control
                    placeholder="Enter Product SKU"
                    value={productSKU}
                  ></Form.Control>
                </Form.Group>
              )}
              <Form.Group className="mb-3">
                <Form.Label>Price Paid</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Amount Paid"
                ></Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Purchase Date</Form.Label>
                <Form.Control type="date"></Form.Control>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check
                  className="my-3"
                  type="checkbox"
                  label="I agree to receive emails about price udpates"
                />
              </Form.Group>
              <Button variant="primary" onClick={getData}>
                Submit
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
