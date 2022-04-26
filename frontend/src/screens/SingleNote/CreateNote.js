import React, { useEffect, useState } from "react";
import MainScreen from "../../components/MainScreen";
import { Button, Card, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { createNoteAction } from "../../actions/notesActions";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

function CreateNote({ history }) {
  const [headline, setHeadline] = useState("");
  const [aboutYou, setAboutYou] = useState("");
  const [education, setEducation] = useState("");
  const [relevantExperience, setRelevantExperience] = useState("");
  const [category, setCategory] = useState("");

  const dispatch = useDispatch();

  const noteCreate = useSelector((state) => state.noteCreate);
  const { loading, error, note } = noteCreate;

  const resetHandler = () => {
    setHeadline("");
    setAboutYou("");
    setEducation("");
    setRelevantExperience("");
    setCategory("");
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createNoteAction(headline, aboutYou, education, relevantExperience, category));
    if (!headline || !aboutYou || !category) return;

    resetHandler();
    history.push("/home");
  };

  useEffect(() => {}, []);

  return (
    <MainScreen title="Create a Post">
      <Card>
        <Card.Header>Create a Post</Card.Header>
        <Card.Body>
          <Form onSubmit={submitHandler}>
            {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
            <Form.Group controlId="title">
              <Form.Label>Headline*</Form.Label>
              <Form.Control
                type="title"
                value={headline}
                placeholder="Enter the title"
                onChange={(e) => setHeadline(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="content">
              <Form.Label>About You*</Form.Label>
              <Form.Control
                as="textarea"
                value={aboutYou}
                placeholder="Enter the content"
                rows={4}
                onChange={(e) => setAboutYou(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="content">
              <Form.Label>Education</Form.Label>
              <Form.Control
                as="textarea"
                value={education}
                placeholder="Enter the content"
                rows={4}
                onChange={(e) => setEducation(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="content">
              <Form.Label>Relevant Experience</Form.Label>
              <Form.Control
                as="textarea"
                value={relevantExperience}
                placeholder="Enter the content"
                rows={4}
                onChange={(e) => setRelevantExperience(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="content">
              <Form.Label>Category*</Form.Label>
              <Form.Control
                type="content"
                value={category}
                placeholder="Enter the Category"
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>
            {loading && <Loading size={50} />}
            <Button type="submit" variant="primary">
              Create Post
            </Button>
            <Button className="mx-2" onClick={resetHandler} variant="danger">
              Reset Feilds
            </Button>
          </Form>
        </Card.Body>

        <Card.Footer className="text-muted">
          Creating on - {new Date().toLocaleDateString()}
        </Card.Footer>
      </Card>
    </MainScreen>
  );
}

export default CreateNote;
