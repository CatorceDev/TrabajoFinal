import Header from "../components/Header.jsx"
import { Outlet, useOutletContext } from "react-router-dom"

function DashboardLayout () {
    const data = useOutletContext()
    return(
        <div className="dashboard-container">
            <Header/>
            <main>
                <Outlet context={data}/>
            </main>
        </div>
    )
}

export default DashboardLayout;