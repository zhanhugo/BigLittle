import React, { useState, useEffect } from 'react';
import { ChannelList } from './ChannelList';
import './chat.scss';
import { MessagesPanel } from './MessagesPanel';
import socketClient from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { listChats, messageMatch } from "../actions/matchActions";

function Chat() {
    const SERVER = "http://127.0.0.1:8080";

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const chatList = useSelector((state) => state.chatList);
    const { cLoading, cError, chats } = chatList;
    
    const [socket, setSocket] = useState(socketClient(SERVER));
    const [channel, setChannel] = useState({})
    const [channels, setChannels] = useState([]);

    const configureSocket = () => {
        socket.once('connection', () => {
            socket.emit('register', { user: userInfo._id });
        });

        socket.once('message', message => {
            updateChannels(message);
        });
    }

    const handleChannelSelect = id => {
        let channel = channels.find(c => {
            return c.id === id;
        });
        setChannel(channel);
    }

    const handleSendMessage = (to, text) => {
        const message = {senderName: userInfo.name, to, text, id: socket.id + Date.now()};
        dispatch(messageMatch(channels.find(channel => channel.id === to).match, message));
        updateChannels(message);
        socket.emit('send-message', message);
    }

    const loadChannels = () => {
        if (chats) {
            setChannels(chats.map((match) => ({ 
                match,
                id: userInfo._id == match.mentorId ? match.userId : match.mentorId,
                name: userInfo._id == match.mentorId ? match.user : match.mentor,
                pic: userInfo._id == match.mentorId ? match.userPic : match.mentorPic,
                messages: match.messages,
                confirmed: match.confirmed
            })));
        }
    }

    const updateChannels = (message) => {
        channels.forEach(c => {
            if (c.id === message.to) {
                if (!c.messages) {
                    c.messages = [message];
                } else {
                    c.messages.push(message);
                }
            }
        });
        setChannels(channels);
    }
    
    useEffect(() => {
        dispatch(listChats());
    }, 
    []);

    useEffect(() => {
        loadChannels()
    }, 
    [chats]);

    useEffect(async () => {
        configureSocket()
    }, 
    [channels]);

    return (
        <div className='chat-app'>
            <ChannelList channels={channels} onSelectChannel={handleChannelSelect} />
            <MessagesPanel onSendMessage={handleSendMessage} channel={channel} />
        </div>
    );
}

export default Chat;