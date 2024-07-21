import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userLogin } from '../services/api';

export default function Login() {

    // Hook - form data
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // Hook - navigation
    const navigate = useNavigate();

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
        </div>
    );
}