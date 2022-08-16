import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
//import { useEffect } from 'react';

import '../App.css';

export default function NavbarIn() {



    //const auth = localStorage.getItem('userid');
    //const auth = sessionStorage.getItem('userid');
    const flag = sessionStorage.getItem('flag');
    //const flag = sessionStorage.getItem('flag');
    //alert(auth);
    const navigate = useNavigate();

    const logout = () => {
        //localStorage.clear();
        sessionStorage.clear();
        //sessionStorage.setItem("flag","false");
        //window.history.forward();
        navigate("/login");
        
    }


    <script type="text/javascript">  
    function preventBack() 
    {window.history.forward()}  
    setTimeout("preventBack()", 0);  
    window.onunload = function () {null};
    </script>



     
    return (
        <nav className="navbar navbar-expand-lg   navbarbg" >
            <div className="container-fluid">
                <Link className="navbar-brand navtxt" to="/"><strong>FabCar</strong></Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0" component="div">

                        {
                            flag === "true" ? 
                                    <li className="nav-item" component="div">
                                        <Link className="nav-link  navtxt" aria-current="page" to="/menupage"><strong>Home</strong></Link>
                                    </li>
                                :
                                    <li className="nav-item" component="div">         
                                        <Link className="nav-link disabled navtxt" aria-current="page" to="/"><strong>Home</strong></Link>
                                    </li>
                                


                        }

                        <li className="nav-item" component="div">
                            <Link className="nav-link navtxt" to="/about"><strong>AboutUs</strong></Link>
                        </li>

                        {
                             flag === "true" ? 
                                <li component="div">
                                    <Link className="nav-link navtxt" role="button" onClick={logout} to="/login" ><strong>Logout</strong></Link>
                                </li>
                                :
                                <li component="div">
                                    <Link className="nav-link navtxt" to="/login" ><strong>Login</strong></Link>
                                </li>
                        }

                    </ul>

                </div>
            </div>
        </nav>

        
    )

    
}
