import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginForm from './components/loginForm.js';
import RegisterForm from './components/registerForm.js';
import ChatScreen from './components/chatScreen.js';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Switch>
          <Route path="/login" component={LoginForm} />
          <Route path="/register" component={RegisterForm} />
          <Route exact path="/" component={LoginForm} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
