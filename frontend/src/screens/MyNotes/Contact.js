import React, { useEffect, useState } from "react";
import MainScreen from "../../components/MainScreen";
import axios from "axios";
import { Button, Card, Form } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { requestMatch } from "../../actions/matchActions";
import emailjs from 'emailjs-com';

function Contact({ match, history }) {
    const [mentorName, setMentorName] = useState();
    const [mentorEmail, setMentorEmail] = useState();
    const [mentorId, setMentorId] = useState();
    const [mentorPic, setMentorPic] = useState();
    const [message, setMessage] = useState();
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const username = userInfo.name;

    useEffect(() => {
        const fetching = async () => {
            const { data } = await axios.get(`/api/notes/${match.params.id}`);
            setMentorName(data.name);
            setMentorEmail(data.email);
            setMentorId(data.user);
            setMentorPic(data.pic);
        };

        fetching();
    }, [match.params.id]);

    const dispatch = useDispatch();

    function sendEmail(e) {
        e.preventDefault();    //This is important, i'm not sure why, but the email won't send without it
        const params = {to_name: mentorName, to_email: mentorEmail, from_name: username};
        emailjs.send('service_3er6kbs', 'template_lvio19j', params, 'user_YkPUCqRE7GeUAAyPMBbJd')
            .then((result) => {
                dispatch(requestMatch(mentorName, mentorId, mentorPic, match.params.id, message));
            }, (error) => {
                console.log(error.text);
            });
        history.push("/home");
    }

    return (
        <MainScreen title="Yeet Note">
            <Card>
                <Card.Header>Contact This Big!</Card.Header>
                <Card.Body>
                    <Form onSubmit={sendEmail}>
                        <Form.Group controlId="content">
                            <Form.Label>Message</Form.Label>
                            <Form.Control
                                as="textarea"
                                placeholder="Enter the message here..."
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Send
                        </Button>
                        <Button
                            className="mx-2"
                            variant="danger"
                            onClick={() => history.push("/home")}
                        >
                            Cancel
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </MainScreen>
    );
}

export default Contact;
