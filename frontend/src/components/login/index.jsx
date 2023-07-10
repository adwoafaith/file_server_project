import React, {useState} from 'react'
import './styles.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'


const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/user/login`, {email, password})
             alert(response.data.message)
             localStorage.setItem('token', response.data.token)
             localStorage.setItem('role', response.data.role)
             navigate('/dashboard')
         } catch (error) {
             alert(error.message)
         }
    }

    return(
        <form className='login-form'>
            <h1 style={{textAlign: 'center'}}>Login</h1>
            <input type="text" placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} autoComplete={"off"}/>
            <input type="password" placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={"off"}/>
            <button role='submit' className='login-btn' onClick={handleLogin}>Login</button>
            <span>Don't have an account? <Link to={'/signup'}>Signup</Link></span>
            
        </form>
    )
}

export default LoginPage;