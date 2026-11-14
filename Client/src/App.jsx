import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Login from './pages/Login.jsx'


function App() {

  return (
    <Routes>
      <Route 
      path="/login" 
      element = {<Login/>}>
      </Route>
    </Routes>
  );
}

export default App;