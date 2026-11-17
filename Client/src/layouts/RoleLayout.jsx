import { useOutletContext } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";
import AdminLayout from "./AdminLayout";

function RoleLayout() {
    const session = useOutletContext();
    const usuario = session?.comprador || session;

    if (session?.comprador.rol === "admin") {
        return <AdminLayout />;
    }

    if (session?.comprador.rol === "comprador") {
        return <DashboardLayout />;
    }
    return null;
}

export default RoleLayout;