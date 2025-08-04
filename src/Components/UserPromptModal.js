import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const UserPromptModal = ({ onSave }) => {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("userInfoSaved");
    if (!saved) setShow(true);
  }, []);

  const handleSubmit = () => {
    if (name && email) {
      onSave({ name, email });
      localStorage.setItem("userInfoSaved", "true");
      setShow(false);
    } else {
      alert("Please enter both name and email.");
    }
  };

  return (
    <Modal show={show} backdrop="static" keyboard={false}>
      <Modal.Header>
        <Modal.Title>Enter Your Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Group>
          <Form.Group className="mt-2">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserPromptModal;