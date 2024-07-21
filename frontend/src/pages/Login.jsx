import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { userLogin } from '../services/api';

const API_URL = import.meta.env.API_URL;

export default function Login() {
    // Hook - form data
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // Hook - navigation
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            // save token into localstorage
            localStorage.setItem('token', token);
            
            window.dispatchEvent(new Event('storage'));

            // Go to home
            navigate('/');
        }

    }, [location, navigate])

    // input handler
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // form handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // fetch user login
            const response = await userLogin(formData);

            // store auth token inside localstorage
            localStorage.setItem('token', response.token);

            // Trigger l'evento storage per aggiornare la Navbar
            window.dispatchEvent(new Event('storage'));

            // Go to home
            navigate('/');

        } catch (error) {
            console.error('Login error:', error);
            alert('Login error. Retry.');
        }
    };

    // input handler
    const handleGoogleLogin = () => {
        // redirect to google login
        window.location.href = `${API_URL}/api/auth/google`;
    };
    
    return (
        <div className='container'>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                type='email'
                name='email'
                placeholder='Email'
                onChange={handleChange}
                required
                />
                <input
                type='password'
                name='password'
                placeholder='Password'
                onChange={handleChange}
                required
                />
                <button type='submit'>Accedi</button>
            </form>
            <button onClick={handleGoogleLogin}>Accedi con Google</button>
        </div>
    );
}