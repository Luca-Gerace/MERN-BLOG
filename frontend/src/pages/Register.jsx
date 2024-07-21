import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

export default function Register() {
    // Hook - form data
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        birthDate: '',
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
            // register user function with form data
            await registerUser(formData);

            alert('Registrazione avvenuta con successo!');

            // Go to login page
            navigate('/login');

        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration error. Retry.');
        }
    };

    return (
        <div className='container'>
        <h2>Registrazione</h2>
        <form onSubmit={handleSubmit}>
            <input
            type='text'
            name='name'
            placeholder='name'
            onChange={handleChange}
            required
            />
            <input
            type='text'
            name='surname'
            placeholder='surname'
            onChange={handleChange}
            required
            />
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
            <input
            type='date'
            name='birthDate'
            onChange={handleChange}
            required
            />
            <button type='submit'>Registrati</button>
        </form>
        </div>
    );
}