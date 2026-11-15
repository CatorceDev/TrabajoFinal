import { Routes, Route } from "react-router-dom";
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ConfirmationEmail from './pages/ConfirmationEmail.jsx'
import ProtectedRoute from "./pages/ProtectedRoute.jsx";

function App() {

  return (
    <Routes>
      
      //TODO: Rutas publicas
      <Route 
      path="/login" 
      element = {<Login/>}>
      </Route>
      <Route
        path="/confirmarinscripcion/:token"
        element = {<ConfirmationEmail/>}
      ></Route>

    //TODO: Rutas protegidas
      <Route
      path="/"
      element= {<ProtectedRoute/>}>
        <Route index element={<Dashboard/>}>

        </Route>
      </Route>
    </Routes>
  );
}

export default App;