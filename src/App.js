import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import BarChart from '../src/components/charts/BarChart';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        <BarChart />
      </div>
    );
  }
}

export default App;
