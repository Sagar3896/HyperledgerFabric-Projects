import React from 'react'
import '../App.css';

export default function EnrollUser() {

    //sessionStorage.clear();

    function idcreate() {
        //sessionStorage.clear();

        var input = document.getElementById('uid').value;

        if (document.getElementById('uid').value.length === 0)
        alert("The textbox cannot be left empty !!");
        else
        // --------> Original Code
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:8081/api/enrolluser" + input, false);
        //alert("step2");
        xhttp.send();
        //alert("step3");
        var data = xhttp.responseText;
         
        console.log("Reponse : ",JSON.parse(data));
        document.write("Reponse : ",JSON.parse(data).message);
        //localStorage.setItem("userid",JSON.stringify(input));
        
        sessionStorage.setItem("flag",JSON.parse(data).flag);
        sessionStorage.setItem("userid",document.getElementById('uid').value);
    }

  


  return (
      
    <div>
    <form className="d-flex flex-column align-items-center" >
        <div className="mb-3 logindiv">
            <label htmlFor="exampleInputEmail1" className="form-label position-absolute start-50 translate-middle fs-2 loginlabel">
                <strong>Enter an ID to enroll yourself !!</strong> </label>
            <input type="text" className="form-control logintxt" id="uid" required />

        </div>
        {<button className="btn btn-primary mt-5 loginbtn" type="button" onClick={idcreate}>Enroll Me !!</button>}
        {/* { <Link className="btn btn-outline-secondary logoutbtn mt-5" role="submit" to="/homepage" onClick="idcreate();">Submit</Link> } */}

    </form>
</div>
)

  
}
