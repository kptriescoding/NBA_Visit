import "./App.css";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";

function App() {
  return <div className="App">
    
     <Router>
        <Routes>
          {/*<Route exact path="/" element={<Login />} />
  <Route exact path="/dashboard" element={<Dashboard />} />*/}
  <Route exact path="/" element={<Login/>}/>
          <Route exact path="/login" element={<Login/>}/>
          <Route exact path="/dashboard" element={<Dashboard/>}/>
          <Route path='*' element={<Navigate to='/' />} />
        </Routes>
      </Router>
  </div>;
}

export default App;
