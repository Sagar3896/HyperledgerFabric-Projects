import React from 'react'
import axios from 'axios';

export default function Querycar() {

    //const uid = localStorage.getItem('userid');
    const uid = sessionStorage.getItem('userid');


    function iddetails() {

        //alert(document.getElementById('id').value);

        var id = document.getElementById('id').value;

        if (id.length === 0)
        alert("The field is mandatory !!");
        else
        document.getElementById('tbdatadiv').className = "tbshow";

        axios.get("http://localhost:8081/api/query" + id + "&" + uid,).then(res => {
            
            console.log(res);
            var table = document.getElementById("tb");
            var row = table.insertRow(1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            cell1.innerHTML = id;
            cell2.innerHTML = JSON.stringify(res.data);
        }).catch(err => {
          console.log(err);
        })
        //document.write(data);



            
    }

  return (
         <div>
            <div className="greetlabel">
                <h1><strong>Hey {uid} ,</strong>  use below option to fecth details !!<span className="label label-defaul "></span></h1>
            </div>

           
                <div className="mb-3 logindiv">
                    <label htmlFor="exampleInputEmail1" className="form-label position-absolute start-50 translate-middle fs-2 loginlabel">
                        <strong>Details of Car</strong> </label>
                    <input type="text" className="form-control  mx-auto logintxt mb-3" id="id" aria-describedby="emailHelp" placeholder='Enter Car ID' required/>
                </div>
                <center>
                <button type="button" className="btn btn-outline-primary loginbtn mt-5 mx-5" onClick={iddetails}>Submit</button>
                </center>

                <div id="tbdatadiv" className="tbhidden">
                <h2 id="h1" className="mt-5" >Please find below the details of specified record :</h2>
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
