import login from "../assets/Login.gif";
import logo from '../assets/logo.png';
import user from '../assets/user2.png';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function SignupPage(){
  const navigate = useNavigate();
  const[name, setName] = useState('');
  const[email, setEmail] = useState('');
  const[password, setPassword] = useState('');
  const[duplicate, setDuplicate] = useState<Boolean>(false);

  function handleSignup(e: any){
    e.preventDefault();
    axios.post('http://localhost:5000/signup', {name ,email, password})
    .then(res => {console.log(res)
    navigate('/login');
    })
    .catch(err => {console.log(err)
     setDuplicate(true);
     console.log(duplicate);
  })

  }

    return(
        <>
           <Container className="d-flex align-items-center justiy-content-evenly gap-5 flex-column flex-lg-row">
               <div className="border p-3 bg-light rounded-3 col-12 shadow-lg col-lg-7 mt-5">
                   <p className="h3 fw-bold text-danger border-bottom my-4 pb-4">SignUp <span className="text-secondary">Page</span></p>
                   <div className="text-center">
                      <img src={user} alt="user" className="img-fluid border rounded-pill p-1"/>
                    </div>
                   <form onSubmit={handleSignup}>
                   <div className="mt-3 px-4">
                      <FloatingLabel controlId="floatingName" label="Username">
                       <Form.Control type="text" placeholder="Enter the Username" value={name} onChange={(e) => setName(e.target.value)} required/>
                       </FloatingLabel>
                    </div>
                  <div className="mt-3 px-4">
                      <FloatingLabel controlId="floatingEmail" label="Email">
                       <Form.Control type="email" placeholder="Enter the Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                       </FloatingLabel>
                    </div>
                    <div className="mt-3 px-4">
                      <FloatingLabel controlId="floatingPassword" label="Password">
                       <Form.Control type="password" placeholder="Enter your Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                       </FloatingLabel>
                    </div>
                    <span className="px-4 float-end"><Link to="/login" className="text-decoration-none text-danger">Already have an account?</Link></span>
                   <div className="d-flex gap-3 mt-5 mb-2 px-4">
                     <button type="submit" className="btn bg-danger mx-auto text-light fw-bold px-lg-5 px-3 py-lg-3 rounded-pill">Continue</button>
                  </div>
                   </form>
               </div>
               <div className="text-center">
                 <div>
                  <img src={logo} alt="logo" className="img-fluid"/>
                 </div>
                <img src={login} alt="login icon" className="img-fluid"/>
               </div>
           </Container>
        </>
    );
}
export default SignupPage;