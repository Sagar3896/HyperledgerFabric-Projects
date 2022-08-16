import React from 'react'

export default function ChangeCarOwner() {

    //const uid = localStorage.getItem('userid');
    const uid = sessionStorage.getItem('userid');

    function ownerchange() {

        var id = document.getElementById('id').value;
        var name = document.getElementById('name').value;

        if (id.length === 0 || name.length === 0)
        alert("Both the fields are mandatory !!");
        else
        document.getElementById('tbdatadiv').className = "tbshow";

        var xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:8081/api/changeowner/" + id + "&" + name + "&" + uid, false);
        //xhttp.open("POST", "/api/changeowner?carid=nn&owner=NN", false);
        xhttp.send();
        var data = xhttp.responseText;

        // alert(document.getElementById('carid').value);
        //alert(data);
        var table = document.getElementById("tb");
        var row = table.insertRow(1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        cell1.innerHTML = id;
        //cell2.innerHTML = JSON.stringify(myArr[i]);
        cell2.innerHTML = data;


    }

    

    return (
        <div>
            <div className="greetlabel">
                <h1><strong>Hey {uid} ,</strong>  You can change the Owner using below form....<span className="label label-defaul "></span></h1>
            </div>

            
                <div className="mb-3 logindiv">
                    <label htmlFor="exampleInputEmail1" className="form-label position-absolute start-50 translate-middle fs-2 loginlabel">
                        <strong>Details to be filled..</strong> </label>
                    <input type="text" className="form-control  mx-auto logintxt mb-3" id="id"  placeholder='Car ID' required />
                    <input type="text" className="form-control  mx-auto logintxt mb-3" id="name"  placeholder='The new Owner Name !!' required />
                </div>
                <center>
                    <button type="button" className="btn btn-outline-primary loginbtn mt-5 mx-5" onClick={ownerchange}>Submit</button>
                </center>

                <div id="tbdatadiv" className="tbhidden">
                <h2 id="h1" className="mt-5" >Please find below the updated record :</h2>
                <table id ="tb" className="table" >
                <thead>
                <tr>
                <th scope="col">Key</th>
                <th scope="col">Data</th>
                </tr>
                </thead>
                </table>
                </div>
        </div>
    )
}
