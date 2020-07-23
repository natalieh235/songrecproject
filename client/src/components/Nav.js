import React from 'react';
import {Link} from 'react-router-dom';

function Nav() {
  return (
    <nav className="nav-bar">
      <Link to='/'>
      <h3>Better Song Rec</h3>
      </Link>
      
      <ul className="nav-links">
        <li>About</li>
        <li>Blog</li>
      </ul>
    </nav>
  );
}

export default Nav;
