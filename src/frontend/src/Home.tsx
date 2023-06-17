import './Home.css';
import { Link } from 'react-router-dom';
import PostOverview from './PostOverview';
import MainFooter from './MainFooter';
import { useEffect, useState } from 'react';
import ProtectedRoute from './ProtectedRoute';

interface Post {
    post_id: number;
    heading: string;
    body: string;
    type: string;
    user_id: number;
    likes: number;
}

function Home() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        async function fetchPosts() {
            const posts = await fetch('http://localhost:8080/get/posts')
                .then((res) => res.json());

            for (let i = 0; i < posts.length; i++) {
                let author = await fetch(`http://localhost:8080/get/username?user_id=${posts[i].user_id}`)
                    .then((res) => res.json());

                author = author[0].name;

                posts[i].name = author;
            }

            setPosts(posts);
            console.log(posts);
        }

        fetchPosts();
    }, []);

    return (
        <ProtectedRoute>
            <div className='posts'>
                <Link to='/newpost' className='post new-post'>
                    <div className='post-create'>
                        <input type='text' placeholder='Create Post'/>
                    </div>
                </Link>
                { posts.map((post) => (
                    <PostOverview post={post} key={post.post_id} />
                ))}
                <MainFooter />
            </div>
        </ProtectedRoute>

    );

}

export default Home;
