import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { userLogin } from '../services/api';
import { Input } from "../components/units";
import GoogleIcon from '@mui/icons-material/Google';
import Alert from '../components/Alert';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5005";

export default function Login() {
    // Hook - form data
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    // Hook - navigation
    const navigate = useNavigate();
    const location = useLocation();

    // Hook - alert
    const [alert, setAlert] = useState(null);

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
            setTimeout(() => {
                navigate('/');
            }, 3000);

            // Show success alert
            setAlert({ message: 'Login successful!', type: 'success' });

        } catch (error) {
            console.error('Login error:', error);
            setAlert({ message: 'Login error. Retry.', type: 'error' });
        }
    };

    // input handler
    const handleGoogleLogin = () => {
        // redirect to google login
        window.location.href = `${API_URL}/api/auth/google`;
    };
    
    return (
        <>
            <h1 className="text-[36px] font-bold text-center mb-6">Login</h1>
            {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
            <form onSubmit={handleSubmit}>
                <Input
                    label='Email'
                    type='email'
                    name='email'
                    id='email'
                    placeholder='Email'
                    onChange={handleChange}
                    required
                />
                <Input
                    label='Password'
                    type='password'
                    name='password'
                    id='password'
                    placeholder='Password'
                    onChange={handleChange}
                    required
                />
                <button type="submit" className="w-full mt-4 p-4 text-white bg-[#646ECB] rounded-md">Login</button>
            </form>
            <div className="flex flex-col mt-8 gap-4">
                <span className="px-4 m-auto">or</span>
                <button onClick={handleGoogleLogin} className="w-full mt-4 p-4 border-2 rounded-md flex gap-4 justify-center items-center"><GoogleIcon /> Login with Google</button>
            </div>
        </>
    );
}