import ProtectedRoute from "./ProtectedRoute";
import './CreatePost.css';

function CreatePost() {
    async function handleCreatePost(e: React.SyntheticEvent) {
        e.preventDefault();

        const post_details = {
            heading: e.target.heading.value,
            body: e.target.body.value,
            user_id: localStorage.getItem('id'),
            type: 'text'
        };

        const request_options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post_details),
        };

        const response = await fetch('http://localhost:8080/createpost', request_options)
            .then((res) => res.json());

        console.log(response);
    }

    return (
        <ProtectedRoute>
            <div className='create-post-wrapper'>
                <form className='new-post-form' onSubmit={handleCreatePost}>
                    <h1>Create post</h1>

                    <input required type='text' name='heading' className='' placeholder='Title' />
                    <textarea required name='body' placeholder='Body'></textarea>

                    <button type='submit'>Create post</button>
                </form>
            </div>
        </ProtectedRoute>

    );

}

export default CreatePost;
