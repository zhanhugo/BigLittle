import React, { useEffect, useState } from "react";
import MainScreen from "../../components/MainScreen";
import axios from "axios";
import { Button, Card, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import emailjs from 'emailjs-com';

function Contact({ match, history }) {
    const [bigName, setBigName] = useState();
    const [bigEmail, setBigEmail] = useState();
    const [message, setMessage] = useState();
    const [fbLink, setFbLink] = useState();
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const username = userInfo.name;

    useEffect(() => {
        const fetching = async () => {
            const { data } = await axios.get(`/api/notes/${match.params.id}`);
            setBigName(data.name);
            setBigEmail(data.email);
        };

        fetching();
    }, [match.params.id]);

    function sendEmail(e) {
        e.preventDefault();    //This is important, i'm not sure why, but the email won't send without it
        const params = {to_name: bigName, to_email: bigEmail, from_name: username, message: message, fb_link: fbLink};
        emailjs.send('service_3er6kbs', 'template_lvio19j', params, 'user_YkPUCqRE7GeUAAyPMBbJd')
            .then((result) => {
                window.location.reload()  //This is if you still want the page to reload (since e.preventDefault() cancelled that behavior) 
            }, (error) => {
                console.log(error.text);
            });
        history.push("/mynotes");
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
                        <Form.Group controlId="content">
                            <Form.Label>Facebook Profile URL</Form.Label>
                            <Form.Control
                                type="content"
                                placeholder="Enter the URL"
                                value={fbLink}
                                onChange={(e) => setFbLink(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Send
                        </Button>
                        <Button
                            className="mx-2"
                            variant="danger"
                            onClick={() => history.push("/mynotes")}
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
