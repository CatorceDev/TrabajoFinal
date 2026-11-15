import { useEffect } from "react";
import "../styles/header.css"
import { Link } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { getComprador } from "../services/compradorServices";
import { useState } from "react";


function Header ({context}) {

    const comprador = context
    console.log(comprador)

    return(
        <header>
            <div className="header-element element-logo">
                <a href="">
                    <div className="logo-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2,18V16q0.95,0 1.41-0.5T5.35,15t1.94,0.5T8.65,16q0.95,0 1.41-0.5Q10.53,15 12,15q1.43,0 1.94,0.5T15.35,16q0.95,0 1.39-0.5T18.65,15t1.94,0.5T22,16v2q-1.42,0-1.94-0.5T18.65,17t-1.36,0.5T15.35,18q-1.43,0-1.94-0.5T12,17q-0.95,0-1.41,0.5T8.65,18T6.74,17.5T5.35,17T3.94,17.5Q3.48,18 2,18Zm0-4V12q0.95,0 1.41-0.5T5.35,11q1.42,0 1.91,0.5T8.65,12q0.95,0 1.41-0.5Q10.53,11 12,11q1.43,0 1.93,0.5T15.3,12q0.95,0 1.41-0.5T18.65,11q1.43,0 1.94,0.5T22,12v2q-1.47,0-1.96-0.5T18.65,13t-1.36,0.5T15.35,14q-1.43,0-1.94-0.5T12,13q-0.95,0-1.39,0.5T8.7,14T6.74,13.5T5.35,13T3.94,13.5T2,14Zm0-4V8Q2.95,8 3.41,7.5T5.35,7Q6.78,7 7.26,7.5T8.65,8Q9.6,8 10.06,7.5Q10.53,7 12,7q1.43,0 1.93,0.5T15.3,8q0.95,0 1.41-0.5T18.65,7q1.43,0 1.94,0.5T22,8v2q-1.47,0-1.96-0.5T18.65,9T17.29,9.5T15.35,10q-1.43,0-1.94-0.5T12,9q-0.95,0-1.39,0.5T8.7,10T6.74,9.5T5.35,9T3.94,9.5T2,10Z"/></svg>
                    </div>
                    <div className="logo-text">
                        <span>Lonja de Veracruz</span>
                        <small>Mercado mayorista · Veracruz</small>
                    </div>
                </a>
            </div>
            <div className="header-element element-buttons">
                <Link className='link-profile' to='/profile'>
                    <div className="container-profileimg">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24px" width="24px" fill="currentColor"><path d="M9.18,10.83Q8,9.65 8,8T9.18,5.18T12,4t2.83,1.18T16,8t-1.17,2.82T12,12T9.18,10.83ZM4,20V17.2q0-0.85 0.44-1.56q0.44-0.71 1.16-1.09q1.55-0.78 3.15-1.16T12,13t3.25,0.39t3.15,1.16q0.72,0.38 1.16,1.09T20,17.2V20H4Zm2-2H18V17.2q0-0.27-0.14-0.5q-0.14-0.22-0.36-0.35q-1.35-0.68-2.72-1.01T12,15T9.23,15.34T6.5,16.35Q6.28,16.48 6.14,16.7Q6,16.93 6,17.2V18Zm7.41-8.59Q14,8.82 14,8T13.41,6.59T12,6T10.59,6.59Q10,7.18 10,8t0.59,1.41T12,10t1.41-0.59ZM12,8Zm0,10Z"/></svg>
                    </div>
                    <div className="container-profilename">
                        <span>{comprador?.name} {comprador?.firstLastName}</span>
                    </div>
                </Link>
            </div>
        </header>
    )
}

export default Header;