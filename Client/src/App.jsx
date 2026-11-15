import { Routes, Route } from "react-router-dom";
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ConfirmationEmail from './pages/ConfirmationEmail.jsx'
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";

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
        <Route element={<DashboardLayout/>}>
          <Route path="/" element={<Dashboard/>}></Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;