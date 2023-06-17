import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';
import Message from './Message';
import ProtectedRoute from './ProtectedRoute';

interface Response {
    status: number,
    message: string
}

function Register() {
    const [responseInfo, setResponseInfo] = useState<Response>({ status: 0, message: '' });
    const [message, setMessage] = useState('');

    async function handle_submit(e: React.SyntheticEvent) {
        e.preventDefault();

        const register_details = {
            name: e.target.name.value,
            email: e.target.email.value,
            password: e.target.password.value,
        };

        const request_options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(register_details),
        };

        const response = await fetch('http://localhost:8080/createuser', request_options)
            .then((res) => res.json());

        console.log(response);
        setResponseInfo(response);
        setMessage(response.message);
    }

    return (
        <ProtectedRoute fromAuth>
            <div className='form-wrapper'>
                <form className='register-form' onSubmit={handle_submit}>
                    <h1>Register</h1>

                    <input name='name' type='text' placeholder='Username' />
                    <input name='email' type='email' placeholder='Email'/>
                    <input name='password' type='password' placeholder='Password' />

                    <button type='submit'>Register</button>
                </form>

                <Link to='/login' className='link-after-form'>Already have an account?</Link>

                { message !== '' &&
                    <Message message={message} type={`${responseInfo.status === 200 ? 'success' : 'error'}`} onTop={true} />
                }
            </div>
        </ProtectedRoute>
    )
}

export default Register;
