import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch, Link } from 'react-router-dom'

import './App.css';
import Login from './components/login'
import SignUp from './components/signup'
import Home from './components/Home';
import Navbar from './components/Navbar';
import Typography from '@material-ui/core/Typography'
import Profile from './components/Profile';

function Copyright() {
  return (
    <Typography variant="body2" color="inherit" align="center">
      {'Copyright © '}
      <Link color="inherit" href="/">
        Social Media
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <header className='nav-header'>
            <Navbar />
          </header>
          <main className="mains">

            <Switch>
              <Route exact path="/"   >
                {localStorage.getItem('token') ? <Redirect to='/home' /> : <Redirect to='/signup' />}

              </Route>
              <Route exact path="/signup" component={SignUp} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/home" component={Home} />
              <Route path="/:id" component={Profile} />
            </Switch>
          </main>

        </div>
      </BrowserRouter>
    )
  }
}

export default App;
