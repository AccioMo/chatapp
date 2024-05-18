import { React, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import '../styles/LoginPage.css';
import { apiClient } from './Auth.jsx';
import { setCookie, getCookie } from './Cookies.jsx';
import { useNavigate } from 'react-router';


function LoginForm() {
	const nav = useNavigate();
	const [ buttonText, setButtonText ] = useState('Login');
	const handleBlur = async (e) => {
		try {
			const username = e.target.value;
			const headers = {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${getCookie('access_token')}`
			};
			const user = await apiClient.get(`/api/users/${username}`, { headers });
			console.log('User found:', user.data);
			user.data.user_exists ? setButtonText('Login') : setButtonText('Sign Up');
		} catch (error) {
			console.error('User not found:', error);
		}
	}
	const [ csrf_token, setToken ] = useState('');
	useEffect( () => {
		const getCsrfToken = async () => {
			const csrfToken = await apiClient.get('/api/csrf/');
			setToken(csrfToken.data);
		}
		getCsrfToken();
	}, []);
	const logUserIn = async (e) => {
		e.preventDefault();
		try {
			const username = e.target.elements.username.value;
			const password = e.target.elements.password.value;
			console.log('username:', username);
			const userData = {
				"username": username,
				"password": password
			};
			apiClient.defaults.headers.common['X-CSRFToken'] = csrf_token
			const record = await apiClient.post('/api/login/', userData)
			sessionStorage.setItem('uuid', record.data.uuid)
			const jwt_token = await apiClient.post('/api/token/', userData,
				{ 'Content-Type': 'application/json' }
			);
			setCookie('refresh_token', jwt_token.data.refresh, 1);
			setCookie('access_token', jwt_token.data.access, 1);
			// localStorage.setItem('authToken', JSON.stringify(jwt_token.data));
			nav('/home');
		}
		catch (error) {
			// if (error.response.status === 404)
			// 	console.log('incorrect password');
			// else if (error.response.status === 500)
			// 	console.log('username not found');
			// else
				console.error('Login error:', error);
		}
	}
	return (
		<div>
			<div className='login-header'></div>
			<form onSubmit={logUserIn} className='login-form'>
				<div className="input-field">
					<label htmlFor="username">Username</label>
					<input className='login-input' type="username" id="username" onBlur={handleBlur} />
				</div>
				<div className="input-field">
					<label htmlFor="password">Password</label>
					<input className='login-input' type="password" id="password" />
				</div>
				<input type="hidden" name="csrfmiddlewaretoken" value={csrf_token} />
				<div className="input-field">
					<button className='login-button' type='submit'>{buttonText}</button>
				</div>
			</form>
		</div>
	)
}

export default LoginForm;