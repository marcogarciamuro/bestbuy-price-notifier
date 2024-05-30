import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";

function Register() {
  const navigate = useNavigate();
  const { createUser, createUserProfile } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasMembership, setHasMembership] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      createUser(email, password).then((userCredential) => {
        const user = userCredential.user;
        createUserProfile(user.uid, hasMembership);
      });
      navigate("/");
    } catch (e) {
      console.log(e.message);
    }
  }

  function handleMembershipChange(e) {
    setHasMembership(e.target.value === "yes");
  }

  return (
    <>
      <h1>Register</h1>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
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
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <div>Do you have a paid membership at Best Buy?</div>
        <Form.Check
          type="radio"
          value="yes"
          label="Yes"
          name="membership"
          onChange={handleMembershipChange}
        ></Form.Check>
        <Form.Check
          className="mb-3"
          type="radio"
          label="No"
          name="membership"
          value="no"
          onChange={handleMembershipChange}
        ></Form.Check>
        <Button onClick={handleSubmit}>Sign Up</Button>
      </Form>
    </>
  );
}

export default Register;
