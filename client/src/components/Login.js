import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { useAuth } from "../contexts/AuthContext";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

function Login() {
  const { logIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function handleLogIn(e) {
    e.preventDefault();
    try {
      logIn(email, password);
      navigate("/trackProduct");
    } catch (e) {
      console.log(e.message);
    }
  }
  return (
    <>
      <h1>Login</h1>
      <Form onSubmit={handleLogIn}>
        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Log In
        </Button>
      </Form>
    </>
  );
}

export default Login;
