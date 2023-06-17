import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';

import Register from './Register';
import Login from './Login';
import Home from './Home';
import Navbar from './Navbar';
import Chats from './Chats';
import NotFound from './NotFound';
import About from './About';
import Profile from './Profile';
import CreatePost from './CreatePost';
import Chat from './Chat';
import CheckProfile from './CheckProfile';

function App() {
    const location = useLocation();

    return (
        <>
            <div className='layout-setter'>
            {
                location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/about' && <Navbar />
            }
            <Routes>
                <Route path='/' element={ <Home /> } />
                <Route path='/chats' element={<Chats />} />
                <Route path='/profile' element={ <Profile /> } />
                <Route path='/profile/:id' element={ <CheckProfile /> } />
                <Route path='/newpost' element={<CreatePost />} />
                <Route path='/login' element={ <Login /> } />
                <Route path='/register' element={ <Register /> } />
                <Route path='/chats/:id' element={<Chat /> } />
                <Route path='/about' element={ <About /> } />
                <Route path="*" element={<NotFound />} />
            </Routes>
            </div>
        </>
       )
}

export default App;
