import { Link } from "react-router-dom";
import { ActiveLink } from "./Navbar";

import './MainFooter.css';

function MainFooter() {
    return (
        <footer className='main-footer'>
            <nav className='footer-nav'>
                <ActiveLink to='/about' className='footer-links' activeClassName='footer-link-active'>About</ActiveLink>
                <ActiveLink to='/legal' className='footer-links' activeClassName='footer-link-active'>Legal</ActiveLink>
                <ActiveLink to='/privacy' className='footer-links' activeClassName='footer-link-active'>Privacy Policy</ActiveLink>
                <ActiveLink to='/tos' className='footer-links' activeClassName='footer-link-active'>Terms of Service</ActiveLink>
            </nav>
        </footer>
    );
}

export default MainFooter;
