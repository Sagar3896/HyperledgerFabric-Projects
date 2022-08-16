import React from 'react'

export default function About() {
    return (
        <div>
            <div className="accordion mx-3 my-3" id="accordionExample" >
                <div className="accordion-item">
                    <h2 className="accordion-header" id="headingOne">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            #About Us
                        </button>
                    </h2>
                    <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
                        <div className="accordion-body">
                            <strong>This is the About Page.</strong> 
                            It is shown by default, click on Login to go Login Page !!
                        </div>
                    </div>
                </div>
            </div>  
        </div>
    )
}
