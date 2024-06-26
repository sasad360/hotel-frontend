import React, { useState } from 'react';
import axiosClient from '../axios-client';
import { useStateContext } from '../Context/ContextProvider';
import VisionLogo from '../Images/visioninn.png';
import Sctech from '../Images/sct.jpg';
import { toast } from 'react-toastify';
 
const LoginComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [role, setRole] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axiosClient.post('/login', {
                email,
                password
            });
            
            // Access token and role from the response data
            const { token, user: { roles } } = response.data;
    
            // Set token and role state
            setToken(token);
            setRole(roles[0].name); // Assuming the user has only one role
            
            // Save token and role to localStorage
            localStorage.setItem('ACCESS_TOKEN', token);
            localStorage.setItem('role', roles[0].name);

            toast.success("Log-in Successful", {
                position: "top-right",
                autoClose: 2000,
                theme: "colored",
            });
            
            // Redirect or do other actions after successful login
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } catch (error) {
            setError('Invalid email or password');
        }
    };
    

    return (
        <div class="login-container">
            <img src={VisionLogo} className='login-logo' />
            <h1>Welcome to VisionInn</h1>
            <p>to login please enter your credentials</p>
            <form onSubmit={handleSubmit} className='mt-1'>
            {error && <div className='red'>{error}</div>}
                <div className='login-field'>
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className='login-field'>
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit">Login</button>
            </form>
            <footer>
                <img src={Sctech} />
                <p>Powered by: Smart Creative Solutions</p>
            </footer>
        </div>
    );
};

export default LoginComponent;
