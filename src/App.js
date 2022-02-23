import './App.css';
import SignUp from './SignUp';
import SignIn from './SignIn';
import Home from './Home';
import Navbar from './Navbar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Settings from './Settings';
import Profile from './Profile'


function App() {
  return (
    <div>
    <Router>
      <div className="App">
        <nav><Navbar /></nav>
        <div className='content'>
          <Switch>
            <Route exact path='/'>
              <Home />
            </Route>
            <Route path='/signin'>
              <SignIn />
            </Route>
            <Route path='/signup'>
              <SignUp />
            </Route>
            <Route path='/settings'>
              <Settings />
            </Route>
            <Route path="/profiles/:profile_tag" children={<Profile />} />
          </Switch>
        </div>
      </div>
    </Router>
    </div>
  );
}

export default App;
