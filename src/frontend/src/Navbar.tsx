import { NavLink } from 'react-router-dom';
import { AiOutlineMessage } from 'react-icons/ai';
import { CgHomeAlt, CgMathPlus, CgProfile, CgSearch } from 'react-icons/cg';

import logo from './assets/logo.png';
import './Navbar.css';


function Navbar() {
    return (
        <nav className='mobile-nav'>
            <img src={logo} alt='Logo' className='nav-logo' />
            <ul className='nav-list'>
                <li>
                    <ActiveLink to='/' className='mobile-nav-link first-item'>
                        <CgHomeAlt />
                        <span>Home</span>
                    </ActiveLink>
                </li>
                <li>
                    <ActiveLink to='/search' className='mobile-nav-link'>
                        <CgSearch />
                        <span>Search</span>
                    </ActiveLink>
                </li>
                <li className='mobile-nav-create'>
                    <ActiveLink to='/newpost' className='mobile-nav-link mobile-nav-create'>
                        <CgMathPlus />
                        <span>Create</span>
                    </ActiveLink>
                </li>
                <li>
                    <ActiveLink to='/chats' className='mobile-nav-link'>
                        <AiOutlineMessage />
                        <span>Chats</span>
                    </ActiveLink>
                </li>
                <li>
                    <ActiveLink to='/profile' className='mobile-nav-link'>
                        <CgProfile />
                        <span>Profile</span>
                    </ActiveLink>
                </li>
            </ul>
            <div className='nav-creator-wrapper'>
                <p className='nav-creator'>Jauleski &copy; 2023</p>
            </div>
        </nav>

    );
}

interface ActiveLinkProps {
    children: JSX.Element | JSX.Element[];
    to: string;
    className: string;
    activeClassName?: string;
}

export function ActiveLink({ children, to, className, activeClassName = 'active'}: ActiveLinkProps) {
    return (
        <NavLink to={to} className={({ isActive }) => 
            isActive ? `${className + ' ' + activeClassName}` : className
        }>
            {children}
        </NavLink>
    );

}

export default Navbar;
