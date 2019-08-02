import React from 'react';
import logo from './logo.svg';
import './App.css';
import Table from './components/full-table';
import Theme from './components/useTheme';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    
    };
    this.Main = this.Main.bind(this);
    this.clearLocalStorage = this.clearLocalStorage.bind(this);
  }

  clearLocalStorage = () => {
    localStorage.clear()
  }

  Main() {
    const { theme, toggleTheme } = Theme();

    return (
      <div style={{background: theme === 'dark' ? '#202020' : '#fff', color: theme === 'dark' ? '#939598' : '#939598', height: '100vh'}}>
        {theme === 'dark' ? (
          <button type='button' onClick={toggleTheme} style={{ margin: '1em 1em -1em' }}>
            <i className='fas fa-sun' style={{color: 'white', fontSize: '1.5rem'}}></i>
          </button>
        ) : (
          <button type='button' onClick={toggleTheme} style={{ margin: '1em 1em -1em' }}>
            <i className='fas fa-moon' style={{color: '#28495f', fontSize: '1.5rem'}}></i>
          </button>
        )}

        <button  type='button' onClick={() => this.clearLocalStorage()} style={{ margin: '1em 1em -1em' }}>
          <div className="nav nav-link" style={{margin: "0"}}>Clear LocalStorage</div>
        </button>

        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>Information Display</h1>
        </header>
        <div className='row'>
          <Table />
        </div>
      </div>
    );
  }

  render() {
    return <this.Main />;
  }
}
export default App;
