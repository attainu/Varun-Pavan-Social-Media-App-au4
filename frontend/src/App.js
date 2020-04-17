import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box'

import './App.css';
import Login from './components/login'
import SignUp from './components/signup'
import Home from './components/Home';
import Navbar from './components/Navbar';

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
          <main className="main mt-3">

            <Switch>
              <Route exact path="/"   >
                {localStorage.getItem('token') ? <Redirect to='/home' /> : <Redirect to='/signup' />}

              </Route>
              <Route path="/signup" component={SignUp} />
              <Route path="/login" component={Login} />
              <Route path="/home" component={Home} />
            </Switch>
          </main>
          <footer className="footer pb-2"><Box mt={3}>
            <Copyright />
          </Box></footer>
        </div>
      </BrowserRouter>
    )
  }
}

export default App;
