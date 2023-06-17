import { useEffect, useState } from "react";
import PostOverview from "./PostOverview";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

function Profile() {
    const [profilePosts, setProfilePosts] = useState([]);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem('name');
        localStorage.removeItem('id');
        localStorage.removeItem('token');

        navigate('/');
    }

    useEffect(() => {
        setUsername(
            JSON.stringify(localStorage.getItem('name')).slice(1, -1)
        );

        const details = {
            id: parseInt(localStorage.getItem('id'))
        }

        fetch(`http://localhost:8080/get/alluserposts?user_id=${details.id}`)
            .then((data) => {
                return data.json();
            })
            .then((data) => {
                console.log(data);
                setProfilePosts(data);
            }).catch((err) => {
                console.log(err)
            });
    }, []);
    
    return (
        <ProtectedRoute>
            <div style={{flex: '1', minHeight: '100vh', padding: '0 3rem'}}>
                <div className=''>
                    <h2>{username}</h2>
                    <button onClick={handleLogout}>Log Out</button>
                </div>

                <h3>My Posts</h3>

                { profilePosts.map((post: any) => ( 
                    <PostOverview post={post} key={post.post_id} editable />
                ))}
            </div>
        </ProtectedRoute>
    );

}

export default Profile;
