import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Allcars() {

  //const uid = localStorage.getItem('userid');
  const uid = sessionStorage.getItem('userid');

  // eslint-disable-next-line 

  const [cars, setCars] = useState([]);

  // cars && cars.map(car => {
  //   console.log(JSON.stringify(car.Key))
  //   console.log(JSON.stringify(car.Record))

  //   //document.getElementById('tbdatadiv').className = "tbshow";

  //   var table = document.getElementById("tb");
  //   var row = table.insertRow(1);
  //   var cell1 = row.insertCell(0);
  //   var cell2 = row.insertCell(1);
  //   cell1.innerHTML = JSON.stringify(car.Key);
  //   cell2.innerHTML = JSON.stringify(car.Record);
  // });


  useEffect(() => {
    axios.get("http://localhost:8081/api/queryallcars" + uid).then(res => {
      setCars(res.data)
      console.log(cars);
    }).catch(err => {
      console.log(err);
    })
    // eslint-disable-next-line
  }, [])


  return (
    <div>
      <div className="greetlabel">
        <h1><strong>Hey {uid} ,</strong>  please find below the records in repo !!<span className="label label-defaul "></span></h1>
      </div>
      <h3><strong>Key : Data </strong><span className="label label-default"></span></h3>
      {
        cars && cars.map(car => {
          return <div className="car-record" key={car.Key}> {JSON.stringify(car.Key)} :  {JSON.stringify(car.Record)} </div>
        })
      }


    </div>

  )
}
