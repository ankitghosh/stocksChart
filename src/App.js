import React, { Component } from 'react';
import StockList from './components/StockList';

import './App.css';

class App extends Component {
    render() {
        return (
            <div className="container">
                <header className="header">
                    <span className="title">Header</span>
                </header>
                <StockList />
                <footer className="footer">
                    <span className="title">Footer</span>
                </footer>
            </div>
        );
    }
}

export default App;
