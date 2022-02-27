import './App.css';
import SignUp from './Views/Auth/SignUp';
import SignIn from './Views/Auth/SignIn';
import Home from './Views/Home/Home';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Settings from './Views/Settings/Settings';
import Profile from './Views/Profile/Profile'


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
