import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import './Login.css';
import Message from './Message';
import ProtectedRoute from './ProtectedRoute';

function Login() {
    const [success, set_success] = useState<boolean | null>(null);
    const [message, set_message] = useState<string>('');

    const navigate = useNavigate();

    async function handle_submit(e: React.SyntheticEvent) {
        e.preventDefault();

        const login_details = {
            name: e.target.name.value,
            password: e.target.password.value,
        };

        const request_options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(login_details),
        };

        const response = await fetch('http://localhost:8080/login', request_options)
            .then((res) => res.json());

        if (response.status === 200) {
            set_success(true);

            localStorage.setItem('token', response.token);
            localStorage.setItem('name', response.userDetails.name);
            localStorage.setItem('id', response.userDetails.user_id);

            navigate('/');
        } else set_success(false);

        set_message(response.message);
    }

    return (
        <ProtectedRoute fromAuth>
            <div className='form-wrapper'>
                <form className='login-form' onSubmit={handle_submit}>
                    <h1>Login</h1>

                    <input name='name' type='text' placeholder='Name' />
                    <input name='password' type='password' placeholder='Password' />

                    <button type='submit'>Login</button>
                </form>

                { message !== '' &&
                    <Message message={message} type={`${success ? 'success' : 'error'}`} onTop={true} />
                }

                <Link to='/register' className='link-after-form'>Don't have an account?</Link>
            </div>
        </ProtectedRoute>
    )
}

export default Login;
