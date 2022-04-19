import React, { useEffect } from "react";
import { Badge, Button, Card } from "react-bootstrap";
import { Grid, useMediaQuery, createTheme } from '@mui/material';
import MainScreen from "../../components/MainScreen";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import { useDispatch, useSelector } from "react-redux";
import { deleteNoteAction, listNotes } from "../../actions/notesActions";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";

function MyNotes({ history, search, my }) {
  const dispatch = useDispatch();

  const noteList = useSelector((state) => state.noteList);
  const { loading, error, notes } = noteList;

  // const filteredNotes = notes.filter((note) =>
  //   note.title.toLowerCase().includes(search.toLowerCase())
  // );

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 900,
        sm: 1350,
        md: 1800,
        lg: 2250,
        xl: 2700,
      },
    },
  });

  const screenExtraLarge = useMediaQuery(theme.breakpoints.only('xl'));
  const screenLarge = useMediaQuery(theme.breakpoints.only('lg'));
  const screenMedium = useMediaQuery(theme.breakpoints.only('md'));
  const screenSmall = useMediaQuery(theme.breakpoints.only('sm'));
  const screenExtraSmall = useMediaQuery(theme.breakpoints.only('xs'));

  const getPostWidth = () => {
    if (screenExtraLarge) {
      return 2;
    } else if (screenLarge) {
      return 2;
    } else if (screenMedium) {
      return 3;
    } else if (screenSmall) {
      return 4;
    } else if (screenExtraSmall) {
      return 6;
    } else {
      return 12;
    }
  }

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const noteDelete = useSelector((state) => state.noteDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = noteDelete;

  const noteCreate = useSelector((state) => state.noteCreate);
  const { success: successCreate } = noteCreate;

  const noteUpdate = useSelector((state) => state.noteUpdate);
  const { success: successUpdate } = noteUpdate;

  useEffect(() => {
    dispatch(listNotes());
    if (!userInfo) {
      history.push("/");
    }
  }, [
    dispatch,
    history,
    userInfo,
    successDelete,
    successCreate,
    successUpdate,
  ]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure?")) {
      dispatch(deleteNoteAction(id));
    }
  };

  return (
    <MainScreen title={`Welcome Back ${userInfo && userInfo.name}..`}>
      <Link to="/createnote">
        <Button style={{ marginLeft: 10, marginBottom: 6 }} size="lg">
          Create new post
        </Button>
      </Link>
      <Grid container spacing={2}>
        {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
        {errorDelete && (
          <ErrorMessage variant="danger">{errorDelete}</ErrorMessage>
        )}
        {loading && <Loading />}
        {loadingDelete && <Loading />}
        {notes &&
          notes
            .filter((filteredNote) =>
              (!my || filteredNote.user === userInfo._id) &&
              (
                filteredNote.name.toLowerCase().includes(search.toLowerCase()) ||
                filteredNote.title.toLowerCase().includes(search.toLowerCase()) ||
                filteredNote.category.toLowerCase().includes(search.toLowerCase())
              )
            )
            .reverse()
            .map((note) => (
            <Grid container item xs={getPostWidth()}>
              <Card style={{ margin: 10, zIndex: 0 }} key={note._id}>
                <Card.Header style={{ display: "flex" }}>
                  <span
                    // onClick={() => ModelShow(note)}
                    style={{
                      color: "black",
                      textDecoration: "none",
                      flex: 1,
                      cursor: "pointer",
                      alignSelf: "center",
                      fontSize: 18,
                    }}
                  >
                    {note.name + ": " + note.title}
                  </span>
                    { userInfo !== undefined && note.user === userInfo._id ?
                      <div>
                        <Button href={`/note/${note._id}`}>Edit</Button>
                        <Button
                          variant="danger"
                          className="mx-2"
                          onClick={() => deleteHandler(note._id)}
                        >
                          Delete
                        </Button>
                      </div> :
                      <div>
                        <Button href={`/contact/${note._id}`}>Request Matching</Button>
                      </div>
                    }
                  </Card.Header>
                    <Card.Body>
                      <h4>
                        <Badge variant="success">
                          Category - {note.category}
                        </Badge>
                      </h4>
                      <blockquote className="blockquote mb-0">
                        <ReactMarkdown>{note.content}</ReactMarkdown>
                        <img src={note.pic} alt={""} className="profilePic" />
                        <footer className="blockquote-footer">
                          Created on{" "}
                          <cite title="Source Title">
                            {note.createdAt.substring(0, 10)}
                          </cite>
                        </footer>
                      </blockquote>
                    </Card.Body>
                </Card>
              </Grid>
            ))}
          </Grid>
    </MainScreen>
  );
}

export default MyNotes;
