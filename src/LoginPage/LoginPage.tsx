import login from "../assets/Login.gif";
import logo from '../assets/logo.png';
import Container from 'react-bootstrap/Container';
import user from '../assets/user2.png';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate} from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function LoginPage(){
   const navigate = useNavigate();

   const[email, setEmail] = useState('');
   const[password, setPassword] = useState('');
   const[err, setErr] = useState('');

  function handleLogin(e:any){
    e.preventDefault();
    axios.post("http://localhost:5000/login", {email, password} , {withCredentials: true})
    .then(res => {
      //console.log(res)
      if(res.status === 200){
        navigate('/main')
        setErr('');
      }
    })
    .catch(err =>{console.log(err);
      setErr(err.response.data);
    })
    }

    return(
        <>
           <Container fluid
                  className="min-vh-100 d-flex align-items-center justify-content-center flex-column flex-lg-row gap-5"
                  >
               <div className="border bg-light p-3 rounded-3 col-12 shadow-lg col-lg-6">
                   <h4 className="border-bottom my-4 pb-4 text-danger fw-bold">Welcome <span className="text-secondary">Back,</span></h4>
                    <div className="d-flex gap-4 align-items-center ps-5">
                        <img src={user} alt="user" className="img-fluid border rounded-pill p-1"/>
                        <p className="text-wrap mt-3"><span className="fw-bold h5">Hello, <span className="text-danger">User</span></span></p>
                    </div>
                    <form onSubmit={handleLogin}>
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
                    <span className="ms-4 text-danger">{err}</span>
                     <div className="float-end"> 
                      <span className="px-4"><Link to='/signup' className="text-decoration-none text-danger">Don't have an account?</Link></span>
                    </div>
                  <div className="my-5 px-4 text-center">
                    <button type="submit" className="btn bg-danger text-light fw-bold px-lg-5 px-3 py-lg-3 rounded-pill">Continue</button>
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
export default LoginPage;