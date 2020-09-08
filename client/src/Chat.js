import React, { useState, useEffect } from "react";
import io from "socket.io-client";

import Messages from './Messages.js';
import InfoBar from './InfoBar';
import Input from './Input';

import './Chat.css';

let socket;

const Chat = ({ room, name }) => {
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const ENDPOINT = 'http://localhost:1337/';

  useEffect(() => {

    socket = io(ENDPOINT);
    console.log(socket);

    socket.emit('join', { name, room }, (error) => {
      if(error) {
        console.error(error);
      }
    });
  }, [room, name]);
  
  useEffect(() => {
    socket.on('message', message => {
      setMessages(messages => [ ...messages, message ]);
    });
    
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
}, []);

  const sendMessage = (event) => {
    event.preventDefault();

    if(message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  return (
    <>
      <div className="container">
          <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
    </>
  );
}

export default Chat;
