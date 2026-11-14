import { Routes, Route } from "react-router-dom";
import Login from './pages/Login.jsx'
import ConfirmationEmail from './pages/ConfirmationEmail.jsx'

function App() {

  return (
    <Routes>
      <Route 
      path="/login" 
      element = {<Login/>}>
      </Route>
      <Route
        path="/confirmarinscripcion/:token"
        element = {<ConfirmationEmail/>}
      ></Route>
    </Routes>
  );
}

export default App;