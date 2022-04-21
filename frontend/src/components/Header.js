import React, {useState, useEffect } from "react";
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
import { listNotifications, confirmMatch, deleteMatch, listChats, messageMatch } from "../actions/matchActions";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import ReactMarkdown from "react-markdown";
import socketClient from "socket.io-client";
import { Launcher } from "../chat_window"

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
      if (notifications.length != currNotificationsCount) {
        setCurrNotificationsCount(notifications.length);
      }
      return notifications.length;
    }
    return currNotificationsCount;
  } 

  const updateChat = async () => {
    await dispatch(listChats());
  };

  const [currNotificationsCount, setCurrNotificationsCount] = useState(notifications ? notifications.length : 0);

  const updateNotifications = async () => {
    await dispatch(listNotifications());
    setTimeout(updateNotifications, 30 * 1000);
  };

  const SERVER = "https://biglittle.herokuapp.com";
    // const SERVER = "127.0.0.1:443";
    
  const [socket, setSocket] = useState(socketClient(SERVER));
  const [channel, setChannel] = useState({});
  const [channels, setChannels] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const configureSocket = () => {
    socket.removeAllListeners();
    if (userInfo) {
      socket.on('connection', () => {
          socket.emit('register', userInfo._id);
      });

      channels.forEach(c => {
        socket.on('message' + c.id, message => {
          if (channel.id == c.id) {
            updateChannel(message);
          }
        });
      });
    }
  }

  const handleSendMessage = (message) => {
      message.id = userInfo._id + Date.now();
      updateChannel(message);
      message = { to: channel.id, type: message.type, data: message.data, id: message.id };
      dispatch(messageMatch(channel.match, message));
      socket.emit('send-message', message);
  }

  const loadChannels = () => {
      if (chats) {
          setChannels(chats.map((match) => ({ 
              match,
              id: userInfo._id == match.mentorId ? match.userId : match.mentorId,
              name: userInfo._id == match.mentorId ? match.user : match.mentor,
              pic: userInfo._id == match.mentorId ? match.userPic : match.mentorPic,
              messages: match.messages.map((message) => ({
                  author: message.id.substring(0, 24) == userInfo._id ? "me" : "them", 
                  type: message.type,
                  data: message.data,
                  id: message.id
              })),
              confirmed: match.confirmed
          })));
      }
  }

  const updateChannel = (message) => {
      message.author = message.id.substring(0, 24) == userInfo._id ? "me" : "them";
      if (!channel.messages) {
          channel.messages = [message];
      } else {
          channel.messages.push(message);
      }
      setChannel(channel=> ({...channel}));
  }
  
  useEffect(() => {
    updateNotifications()
    updateChat()
  }, 
  [userInfo]);

  useEffect(() => {
      loadChannels()
  }, 
  [chats]);

  useEffect(() => {
    if (channel.id) {
      setIsOpen(true);
    }
  }, 
  [channel]);

  useEffect(() => {
    configureSocket()
  }, 
  [channels]);

  return (
    <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
      <Launcher 
          style={{zIndex:"20"}}
          agentProfile={{
              teamName: channel.name,
              imageUrl: channel.pic
          }}
          isOpen={isOpen}
          handleClick={toggleChat}
          onMessageWasSent={handleSendMessage}
          messageList={channel.messages ? channel.messages : []} 
      />
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
                <NavDropdown
                  title={"Chat"}
                  id="collasible-nav-dropdown"
                  onClick={updateChat}
                >
                  {!cError && !cLoading && channels && 
                  channels
                  .map((c) => (
                    <div>
                      <NavDropdown.Item onClick={() => setChannel(c)}>
                        <div>
                          <img src={c.pic} alt={""} className="circularProfilePic" />
                          {" " + c.name}
                        </div>
                      </NavDropdown.Item>
                    </div>
                  ))}
                </NavDropdown>
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
