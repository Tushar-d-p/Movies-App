import Movies from "./Components/Movies";
import Home from "./Components/Home";
import About from "./Components/About";
import Nav from "./Nav";
import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
function App() {
  return (
  // <Movies/>
  <Router>
    <Nav/>
    <Switch>
      <Route path="/" exact component={Home}></Route>
      <Route path="/movies" component={Movies}></Route>
      <Route path="/about" component={About}></Route>
    </Switch>
  </Router>
  );
}

export default App;
