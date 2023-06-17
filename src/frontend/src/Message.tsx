import './Message.css';

function Message(props: { message: string, modal?: boolean, type?: string, onTop?: boolean }) {
    let message = <p className={`${props.type}`}>{props.message}</p>;


    if (props.modal) {
        return (
            <div className="modal">
                {message}
            </div>
        );
    }

    if (props.onTop) {
        return (
            <div className={`message-on-top ${props.type === 'success' ? 'bg-success' : 'bg-error'}`}>
                {message}
            </div>
        );

    }

    return message;

}

export default Message;
