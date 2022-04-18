import {useEffect, React} from "react";
import {
  Container,
  Form,
  FormControl,
  Nav,
  Navbar,
  NavDropdown,
  Card, 
  Button
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {} from "react-router-dom";
import { logout } from "../actions/userActions";
import { listMatches } from "../actions/matchActions";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import ReactMarkdown from "react-markdown";

function Header({ setSearch }) {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
  };

  const clickMessage = (match) => {
    const options = {
      childrenElement: () => <div />,
      customUI: () => (
        <Card style={{ margin: 10 }} key={match._id}>
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
              { "Message From " + match.user}
            </span>
          </Card.Header>
          <Card.Body>
            <blockquote className="blockquote mb-0">
              <ReactMarkdown>
                {
                  "Hello " + match.mentor + ",\n\n" + 
                  match.user + " is interested in being your Little! Here's what they said:\n\n" + 
                  "\t" + match.message + "\n\n" + 
                  "Click Confirm to become their Big!"
                }
              </ReactMarkdown>
              <img src={match.pic} alt={""} className="profilePic" />
              <footer className="blockquote-footer">
                Sent on{" "}
                <cite title="Source Title">
                  {match.createdAt.substring(0, 10)}
                </cite>
                <div>
                  <Button 
                    // onClick={() => deleteHandler(match._id)}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="danger"
                    className="mx-2"
                    // onClick={() => deleteHandler(match._id)}
                  >
                    Delete
                  </Button>
                </div>
              </footer>
            </blockquote>
          </Card.Body>
        </Card>
      ),
      willUnmount: () => {}
    }
  
    confirmAlert(options)
  }
  
  const matchList = useSelector((state) => state.matchList);
  const { loading, error, matches } = matchList;

  const inboxCount = () => {
    if (!error && matches) {
      return matches.length;
    } else {
      return "loading..";
    }
  } 

  const updateInbox = async () => {
    await dispatch(listMatches(true, false, false));
    setTimeout(updateInbox, 30 * 1000);
  };

  useEffect(() => {
    updateInbox()
  }, 
  []);

  return (
    <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
      <Container fluid>
        <Navbar.Brand href="/explore">BigLittle</Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="m-auto">
            {userInfo && (
              <Form inline>
                <FormControl
                  type="text"
                  placeholder="Search"
                  className="mr-sm-2"
                  style={{width: "320px"}}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Form>
            )}
          </Nav>
          <Nav>
            {userInfo ? (
              <>
                <Nav.Link href="/myposts">My Posts</Nav.Link>
                <NavDropdown
                  title={
                    <div>
                      Inbox
                      <span
                        className="badge badge-pill badge-dark small font-weight-light ml-1"
                        title="Unread"
                      >
                        {inboxCount()}
                      </span>
                    </div>
                  }
                  id="collasible-nav-dropdown"
                  alignRight={true}
                  onClick={updateInbox}
                > 
                {matches && 
                matches
                .map((match) => (
                  <div>
                    <NavDropdown.Item onClick={() => clickMessage(match)}>
                      <div>
                        <img src={match.userPic} alt={""} className="circularProfilePic" />
                        {" " + match.user + " wants to become your little!"}
                        <br></br>
                        Click to view this message...
                      </div>
                    </NavDropdown.Item>
                  </div>
                ))}
                </NavDropdown>
                <NavDropdown
                  title={`${userInfo.name}`}
                  id="collasible-nav-dropdown"
                  alignRight={true}
                >
                  <NavDropdown.Item href="/profile">
                    {/* <img
                      alt=""
                      src={`${userInfo.pic}`}
                      width="25"
                      height="25"
                      style={{ marginRight: 10 }}
                    /> */}
                    My Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <Nav.Link href="/login">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
