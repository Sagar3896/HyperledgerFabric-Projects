import React from 'react'
import { Link } from 'react-router-dom';
import '../App.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';


export default function HomePage() {

    //const uid = localStorage.getItem('userid');
    const uid = sessionStorage.getItem('userid');

    const navigate =   useNavigate();

    useEffect(() => {
        //const auth = localStorage.getItem('userid');
        const auth = sessionStorage.getItem('userid');
        if(auth){
            navigate("/menupage");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
           
            <div className="greetlabel">
            <h1><strong>Hey {uid} ,</strong>  Feel free to explore the below options !!<span className = "label label-defaul "></span></h1>
            </div>

            <div className="card homepagelinks homepagealldiv" >
                <img src="../Images/allcars.jpeg" className="card-img-top homepageimg" alt="..." />
                <div className="card-body ">
                <h5 className="card-title">All Cars</h5>
                <p className="card-text">Click on this Link, to display all Cars !!</p>
               
                <Link className="btn btn-primary stretched-link" to="/listcars"><strong>Get All Cars</strong></Link>
                </div>
            </div>

            <div className="card homepagelinks homepageinsertdiv" >
                <img src="../../Images/insertcar.png" className="card-img-top homepageimg" alt="..." />
                <div className="card-body">
                <h5 className="card-title">Insert a Car</h5>
                <p className="card-text">Click on this Link, inorder to insert a record !!</p>
                <Link className="btn btn-primary stretched-link" to="/createcar"><strong>Insert a Car</strong></Link>
                </div>
            </div>

            <div className="card homepagelinks homepagequerydiv" >
                <img src="../../Images/querycar.jpeg" className="card-img-top homepageimg" alt="..." />
                <div className="card-body ">
                <h5 className="card-title">Query a Car</h5>
                <p className="card-text">Click on this Link, inorder to view a record !!</p>
                <Link className="btn btn-primary stretched-link" to="/querycar"><strong>Query Car</strong></Link>
                </div>
            </div>

            <div className="card homepagelinks homepageupdatediv" >
                <img src="../../Images/changeowner.jpeg" className="card-img-top homepageimg" alt="..." />
                <div className="card-body ">
                <h5 className="card-title">Change the owner</h5>
                <p className="card-text">Click on this Link, inorder to change the owner of car !!</p>
                <Link className="btn btn-primary stretched-link" to="/changeowner"><strong>Change Car Owner</strong></Link>
                </div>
            </div>
        </div>
    )
}
