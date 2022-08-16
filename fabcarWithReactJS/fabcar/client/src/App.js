//import logo from './logo.svg';
import  React  from 'react'
import './App.css'
import Home from './components/Home'
import Login from './components/Login'
import About from './components/About'
import Navbar from './components/NavbarIn'


import {
  BrowserRouter as Router,
  Route,
  Routes
  } from "react-router-dom";
import HomePage from './components/HomePage';
import EnrollUser from './components/EnrollUser'
import PrivateComponent from './components/PrivateComponent';
import Createcar from './components/Createcar'
import Querycar from './components/Querycar'
import ChangeCarOwner from './components/ChangeCarOwner'
import Error from './components/Error'
import Allcars from './components/Allcars'


function App() {


  const flag = sessionStorage.getItem('flag');
  


  return (
    <>
      <Router>
      <Navbar title="TextUtils" abouttxt = 'AboutUs'/>
      <div className='container'> 
      <Routes>
        <Route element={<PrivateComponent/> } />  
        <Route exact path="/about" element={<About />} />
        <Route exact path="/" element = {<Home />} />
        <Route exact path="/login" element={<Login /> } />
        <Route exact path="/enrolluser" element={<EnrollUser /> } />
        
       { flag && <Route exact path="/menupage" element={<HomePage />} /> }  
       { flag && <Route exact path="/listcars" element={<Allcars /> } />} 
       { flag && <Route exact path="/createcar" element={<Createcar /> } />}
       { flag && <Route exact path="/querycar" element={<Querycar /> } />}
       { flag && <Route exact path="/changeowner" element={<ChangeCarOwner /> } />} 
       { <Route exact path="/*" element={<Error /> } /> }

      </Routes>
      </div>
      </Router>
      

    </>
  );
}

export default App;
