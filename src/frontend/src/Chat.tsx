import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import ChatMessage from "./ChatMessage";
import { AiOutlineSend } from 'react-icons/ai';
import io from 'socket.io-client';

import './Chat.css';

function useQuery() {
  const { search } = useLocation();

  return useMemo(() => new URLSearchParams(search), [search]);
}

interface Message {
    message_id: number;
    conversation_id: number;
    sender_id: number;
    content: string;
}

let user_id = parseInt(localStorage.getItem('id'));

const socket = io('http://localhost:8080');

function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const formRef = useRef(null);
    const bottomRef = useRef(null);

    let { id } = useParams();
    let query = useQuery();

    useEffect(() => {
        async function fetchMessages() {
            let messages = await fetch(`http://localhost:8080/get/messages?conversation_id=${id}`)
                .then((res) => res.json());

            setMessages(messages);
        }

        fetchMessages();

        socket.on('chatMessage', (message) => {
            message = JSON.parse(message);
            setMessages((prevMessages) => [...prevMessages, message]);
            setTimeout(() => {
                bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 50);
        });

        return () => {
            socket.off('chatMessage');
        }
    }, []);

    async function handleNewMessage(e: React.SyntheticEvent) {
        e.preventDefault();

        const message = {
            conversation_id: parseInt(id),
            sender_id: user_id,
            content: e.target.content.value,
        }

        const request_options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message),
        };

        socket.emit('chatMessage', message);

        formRef.current.value = null;
        setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
    }

    return (
        <>
            <div className='chat'>
                <div className='chat-wrapper'>
                    { messages.map((message) => (
                            <Fragment key={message.message_id}>
                                <ChatMessage
                                    message={message}
                                    name={message.sender_id === user_id ? localStorage.getItem('name') : query.get('name')}
                                    className={message.sender_id === user_id ? 'primary-user-msg' : 'secondary-user-msg'}
                                />
                            <div ref={bottomRef}></div>
                            </Fragment>
                    ))}
                </div>
                <form className='new-msg-form' onSubmit={handleNewMessage}>
                    <textarea className='new-msg' name='content' ref={formRef}></textarea>
                    <button className='new-msg-button'>
                        <AiOutlineSend />
                    </button>
                </form>
            </div>

        </>
    );

}

export default Chat;
