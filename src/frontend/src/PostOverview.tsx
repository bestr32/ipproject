import { Link } from "react-router-dom";
import LikeBar from "./LikeBar";
import { SlShare } from "react-icons/sl";
import { useState } from "react";

const user_id = parseInt(localStorage.getItem('id'));

function PostOverview(props: any) {
    const post = props.post;
    const temp_body = post.body.length < 100 ? post.body : `${post.body.substring(0, 100)}...`;

    const [postBody, setPostBody] = useState(temp_body);

    function showFullPost() {
        setPostBody(post.body);
    }

    return (
        <div className='post'>
            <Link to={post.user_id === user_id ? '/profile' : `/profile/${post.user_id}`}>
            <p className='post-author'>{post.name}</p>
            </Link>

            <h2 onClick={showFullPost} style={{cursor: 'pointer'}}>{post.heading}</h2>
            <p onClick={showFullPost} className='post-body'>{postBody}</p>

            <div className='post-interactions'>
                <LikeBar likes={post.likes} />

                { props.editable && (
                    <Link to='/editpost'>
                        Edit
                    </Link>
                )}

                <button className='share-button'>
                    <SlShare />
                </button>
            </div>
        </div>
    );

}

export default PostOverview;
