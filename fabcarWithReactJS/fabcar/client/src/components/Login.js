//import React, {Component} from 'react';
// import { render } from 'react-dom'
// import { Link } from 'react-router-dom';
//import { Cookie } from 'express-session';
import '../App.css';


export default function Login() {

    
    
    function idcreate() {
        var input = document.getElementById('uid').value;
        //document.write(input);
        //alert('reached here !!');
        // alert(document.getElementById('uid').value);
        if (document.getElementById('uid').value.length === 0)
            alert("The textbox cannot be left empty !!");
        else
            // --------> Original Code
        var xhttp = new XMLHttpRequest();
        xhttp.open("GET", "http://localhost:8081/api/checkuser" + input, false);
        //xhttp.responseType = Text;
        // alert("step2");
        xhttp.send(); 
        //alert(xhttp.status);
        var data = xhttp.responseText;
        //alert("Response : " + data);
        console.log("Reponse : ",JSON.parse(data));
        document.write("Reponse : ",JSON.parse(data).message);
        //window.localStorage.setItem("userid",JSON..messstringify(input));
        sessionStorage.setItem("userid",input);
        sessionStorage.setItem("flag",JSON.parse(data).flag);
        
    }


    return (
        <div>
            <form className="d-flex flex-column align-items-center">
            <div className="mb-3 logindiv">
                    <label htmlFor="exampleInputEmail1" className="form-label position-absolute start-50 translate-middle fs-2 loginlabel">
                    <strong>Login ID</strong> </label>
                    <input type="text" className="form-control  logintxt" id="uid" required />
                </div>
                {<button className="btn btn-primary mt-5 loginbtn" type="button" onClick={idcreate} >Submit</button>}
                {/* { <Link className="btn btn-outline-secondary logoutbtn mt-5" role="submit" to="/homepage" onClick="idcreate();">Submit</Link> } */}

            </form>

         

        </div>
    )
}


