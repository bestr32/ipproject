import { useEffect, useState } from "react";
import ProtectedRoute from "./ProtectedRoute";
import { Link } from "react-router-dom";

const user_id = localStorage.getItem('id');

interface Conversations {
    conversation_id: number;
    user_id1: number;
    user_id2: number;
    receiver_name: string;
}

function Chats() {
    const [conversations, setConversations] = useState<Conversations[]>([]);

    useEffect(() => {
        async function fetchData() {
            const temp_conversations = await fetch(`http://localhost:8080/get/userconversations?user_id=${user_id}`)
                .then(res => res.json());

            const temp_receiver_ids = [];

            for (let i = 0; i < conversations.length; i++) {
                if (conversations[i].user_id1 !== parseInt(user_id))
                    temp_receiver_ids.push(conversations[i].user_id1);
                else
                    temp_receiver_ids.push(conversations[i].user_id2);
            }

            for (let i = 0; i < temp_receiver_ids.length; i++) {
                const data = await fetch(`http://localhost:8080/get/username?user_id=${temp_receiver_ids[i]}`)
                    .then((res) => res.json())

                temp_conversations[i].receiver_name = data[0].name;
            }

            console.log(temp_conversations);

            setConversations(temp_conversations);
        }

        fetchData();
    });

    return (
        <ProtectedRoute>
            <div className='chats-wrapper' style={{flex: '1', minHeight: '100vh'}}>
                { conversations.map((conversation) => (
                    <Link 
                        to={`/chats/${conversation.conversation_id}?name=${conversation.receiver_name}`}
                        key={conversation.conversation_id}
                    >
                        <p>
                            { conversation.receiver_name }
                        </p>
                    </Link>
                ))}
            </div>
        </ProtectedRoute>

    );

}

export default Chats;
