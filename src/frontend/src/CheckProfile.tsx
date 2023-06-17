import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostOverview from "./PostOverview";

function CheckProfile() {
    let { id } = useParams();
    const [name, setName] = useState('');
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function fetchProfile() {
            let name = await fetch(`http://localhost:8080/get/username?user_id=${id}`)
                .then((res) => res.json());

            let posts = await fetch(`http://localhost:8080/get/alluserposts?user_id=${id}`)
                .then((res) => res.json());

            name = name[0].name;

            setName(name);
            setPosts(posts);
        }

        fetchProfile();
    }, []);

    return (
        <>
            <h2>{name}</h2>
            { posts.map((post) => (
                <PostOverview post={post} key={post.post_id} />

            ))}
        </>

    );
}

export default CheckProfile;
