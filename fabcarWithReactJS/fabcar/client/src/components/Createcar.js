
//import { Link, useNavigate } from 'react-router-dom';

export default function Createcar() {

    //const uid = localStorage.getItem('userid');
    const uid = sessionStorage.getItem('userid');


    return (
        <div>
            <div className="greetlabel">
                <h1><strong>Hey {uid} ,</strong>  fill in the details to insert record !!<span className="label label-defaul "></span></h1>
            </div>
        


            <form method='POST' action='http://localhost:8081/api/addcar/' >
                <div className="mb-3 logindiv">
                    <label htmlFor="exampleInputEmail1" className="form-label position-absolute start-50 translate-middle fs-2 loginlabel">
                        <strong>Details of Car</strong> </label>
                    <input type="text" className="form-control  mx-auto logintxt mb-3" id="Carid" name="Carid" placeholder='Car ID' required />
                    <input type="text" className="form-control  mx-auto logintxt mb-3" id="Make" name="Make" placeholder='Make' required />
                    <input type="text" className="form-control  mx-auto logintxt mb-3" id="Model" name="Model" placeholder='Model' required />
                    <input type="text" className="form-control  mx-auto logintxt mb-3" id="Colour" name="Colour" placeholder='Colour' required />
                    <input type="text" className="form-control  mx-auto logintxt mb-3" id="Owner" name="Owner" placeholder='Owner' required />
                </div>
                <center>
                    <button type="submit" className="btn btn-outline-primary loginbtn mt-5 mx-5">Submit</button>
                </center>
            </form>
        </div>
    )
}

