import React, { useEffect, useState } from "react";
import MainScreen from "../../components/MainScreen";
import axios from "axios";
import { Button, Card, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteNoteAction, updateNoteAction } from "../../actions/notesActions";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";

function SingleNote({ match, history }) {
  const [headline, setHeadline] = useState("");
  const [aboutYou, setAboutYou] = useState("");
  const [education, setEducation] = useState("");
  const [relevantExperience, setRelevantExperience] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const dispatch = useDispatch();

  const noteUpdate = useSelector((state) => state.noteUpdate);
  const { loading, error } = noteUpdate;

  const noteDelete = useSelector((state) => state.noteDelete);
  const { loading: loadingDelete, error: errorDelete } = noteDelete;

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteNoteAction(id));
    }
    history.push("/home");
  };

  useEffect(() => {
    const fetching = async () => {
      const { data } = await axios.get(`/api/notes/${match.params.id}`);

      setHeadline(data.headline);
      setAboutYou(data.aboutYou);
      setEducation(data.education);
      setRelevantExperience(data.relevantExperience);
      setCategory(data.category);
      setDate(data.updatedAt)
    };

    fetching();
  }, [match.params.id, date]);

  const resetHandler = () => {
    setHeadline("");
    setAboutYou("");
    setEducation("");
    setRelevantExperience("");
    setCategory("");
  };

  const updateHandler = (e) => {
    e.preventDefault();
    dispatch(updateNoteAction(match.params.id, headline, aboutYou, education, relevantExperience, category));
    if (!headline || !aboutYou || !category) return;

    resetHandler();
    history.push("/home");
  };

  return (
    <MainScreen title="Edit your Post">
      <Card>
        <Card.Header>Edit your Post</Card.Header>
        <Card.Body>
          <Form onSubmit={updateHandler}>
            {loadingDelete && <Loading />}
            {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
            {errorDelete && (
              <ErrorMessage variant="danger">{errorDelete}</ErrorMessage>
            )}
            <Form.Group controlId="title">
              <Form.Label>Headline</Form.Label>
              <Form.Control
                type="title"
                value={headline}
                placeholder="Enter the title"
                onChange={(e) => setHeadline(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="content">
              <Form.Label>About You</Form.Label>
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
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="content"
                value={category}
                placeholder="Enter the Category"
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>
            {loading && <Loading size={50} />}
            <Button variant="primary" type="submit">
              Update your Post
            </Button>
            <Button
              className="mx-2"
              variant="danger"
              onClick={() => deleteHandler(match.params.id)}
            >
              Delete your Post
            </Button>
          </Form>
        </Card.Body>

        <Card.Footer className="text-muted">
          Updated on - {date.substring(0, 10)}
        </Card.Footer>
      </Card>
    </MainScreen>
  );
}

export default SingleNote;
