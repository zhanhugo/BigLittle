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
import { listNotifications, confirmMatch, deleteMatch, listChats } from "../actions/matchActions";
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

  const confirmHandler = (matchId) => {
    dispatch(confirmMatch(matchId));
  };

  const deleteHandler = (matchId) => {
    dispatch(deleteMatch(matchId));
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
              { "Message From " + match.mentorId === userInfo._id ? match.user : match.mentor}
            </span>
          </Card.Header>
          <Card.Body>
            <blockquote className="blockquote mb-0">
              <ReactMarkdown>
                {
                  match.mentorId === userInfo._id 
                    ? "Hello " + match.mentor + ",\n\n" + 
                    match.user + " is interested in being your Little! Here's what they said:\n\n" + 
                    "\t" + match.messages[0].text + "\n\n" + 
                    "Click Confirm to become their Big!"
                    : "Hello " + match.user + ",\n\n" + 
                    match.mentor + " expressed interest in being your big\n\n" + 
                    "They should now appear in your chat box!"
                }
              </ReactMarkdown>
              <footer className="blockquote-footer">
                Sent on{" "}
                <cite title="Source Title">
                  {match.mentorId === userInfo._id ? match.createdAt.substring(0, 10) : match.updatedAt.substring(0, 10)}
                </cite>
                <div>
                  <Button 
                    href='/chat'
                    onClick={() => confirmHandler(match)}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="danger"
                    className="mx-2"
                    onClick={() => deleteHandler(match)}
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

  const chatList = useSelector((state) => state.chatList);
  const { cLoading, cError, chats } = chatList;

  const chatsCount = () => {
    if (!cError && chats) {
      return chats.length;
    } else if (cLoading) {
      return "loading..";
    } else {
      return 0;
    }
  } 

  const notificationsList = useSelector((state) => state.notificationsList);
  const { loading, error, notifications } = notificationsList;

  const notificationsCount = () => {
    if (!error && notifications) {
      return notifications.length;
    } else if (loading) {
      return "loading..";
    } else {
      return 0;
    }
  } 

  const updateChat = () => {
    dispatch(listChats());
  };

  const updateNotifications = async () => {
    await dispatch(listNotifications());
    setTimeout(updateNotifications, 30 * 1000);
  };

  useEffect(() => {
    updateNotifications()
    updateChat()
  }, 
  [userInfo]);

  return (
    <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
      <Container fluid>
        <Navbar.Brand href="/home">BigLittle</Navbar.Brand>

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
                <Nav.Link href="/chat" onClick={updateChat}>
                  <div>
                    Chat
                    <span
                      className="badge badge-pill badge-dark small font-weight-light ml-1"
                      title="Unread"
                    >
                      {chatsCount()}
                    </span>
                  </div>
                </Nav.Link>
                <NavDropdown
                  title={
                    <div>
                      Notification
                      <span
                        className="badge badge-pill badge-dark small font-weight-light ml-1"
                        title="Unread"
                      >
                        {notificationsCount()}
                      </span>
                    </div>
                  }
                  id="collasible-nav-dropdown"
                  alignRight={true}
                  onClick={updateNotifications}
                > 
                {notifications && 
                notifications
                .map((match) => (
                  <div>
                    <NavDropdown.Item onClick={() => clickMessage(match)}>
                      <div>
                        <img src={match.mentorId === userInfo._id ? match.userPic : match.mentorPic} alt={""} className="circularProfilePic" />
                        {match.mentorId === userInfo._id 
                          ? " " + match.user + " wants to become your little!"
                          : " " + match.mentor + " expressed ineterest in being your big!"
                        }
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
                  <NavDropdown.Item href="/" onClick={logoutHandler}>
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
