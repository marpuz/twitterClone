import "./App.css";
import SignUp from "./Views/Auth/SignUp";
import SignIn from "./Views/Auth/SignIn";
import Home from "./Views/Home/Home";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Settings from "./Views/Settings/Settings";
import Profile from "./Views/Profile/Profile";
import Wrapper from "./Components/Wrapper/Wrapper";
import { SupabaseContextProvider } from "./State";

function App() {
  return (
    <div className="App">
      <SupabaseContextProvider>
        <Router>
          <Switch>
            <Route path="/signin">
              <SignIn />
            </Route>
            <Route path="/signup">
              <SignUp />
            </Route>
            <Wrapper>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/settings">
                <Settings />
              </Route>
              <Route path="/profiles/:profile_tag" children={<Profile />} />
            </Wrapper>
          </Switch>
        </Router>
      </SupabaseContextProvider>
    </div>
  );
}

export default App;
