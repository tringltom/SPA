import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Welcome developers... and Nikola.
        </p>
        <p>
          If you see this it means that CI/CD for SPA is working!
        </p>
        <p>
          For real this time?
        </p>
      </header>
    </div>
  );
}

export default App;
