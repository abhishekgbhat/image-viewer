import React, { Component } from 'react';
import './Header.css';

class Header extends Component {

    render() {
        return (
            <header className="app-header">
                <span className="app-header-text"> Image Viewer </span>
            </header>
        )
    }
}

export default Header;