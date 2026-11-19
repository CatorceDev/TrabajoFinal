import { Routes, Route } from "react-router-dom";
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ConfirmationEmail from './pages/ConfirmationEmail.jsx'
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RoleLayout from "./layouts/RoleLayout.jsx"
import Profile from "./pages/Profile.jsx";

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
        <Route path="profile" element={<Profile />} />
        <Route element={<RoleLayout/>}>
          <Route index element={<Dashboard/>} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;