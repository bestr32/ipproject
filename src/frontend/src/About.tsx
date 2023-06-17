import { Link, Navigate, useNavigate } from 'react-router-dom';
import logo from './assets/logo.png';
import MainFooter from './MainFooter';
import './About.css';

function About() {
    return (
        <>
            <div className='about-section'>
                <h1>About</h1>
                <p>
                    This is a project I made for the subject Internet Programming.
                    My goal was to make something akin of a social media, but it ended up being
                    something more like Reddit, a place to talk about various topics.
                </p>
                <p>
                    It obviously doesn't have all of the nuances the giant apps have,
                    there is a lot of work to do, especially on the back-end in terms of
                    security as well as the design of the database.
                </p>
                <p>
                    For the purpose of finishing by the deadline, I used Node.JS with Express
                    on the back-end. I assume that the giant apps don't use Node.JS as their
                    main drive. Small portions may be made in Node.JS but they probably use
                    something like Go, or even C++ for key microservices.
                </p>
                <div className='go-home-wrapper'>
                    <Link to='/'>
                        <img src={logo} />
                    </Link>
                    <Link to='/' className='go-home-link'>go home</Link>
                </div>
                <MainFooter />
            </div>
        </>

    );

}

export default About;
