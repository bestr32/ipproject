import './ChatMessage.css';

function ChatMessage(props: any) {
    return (
        <div className='chat-message'>
            <h2 className='sender-name'>{props.name}</h2>
            <p className={props.className}>
                {props.message.content}
            </p>
        </div>
    );

}

export default ChatMessage;
