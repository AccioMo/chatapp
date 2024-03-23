import { React, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";
import Home from "./components/Home";
import { Navigate } from 'react-router';
import ChatsPage from "./components/ChatsPage.jsx";
import AboutPage from "./components/AboutPage.jsx";
import SignUpPage from "./components/SignUpPage";
import axios from "axios";
import './styles/App.css';

const PrivateRoute = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(null);
	useEffect(() => {
		const checkAuthentication = async () => {
			try {
				const response = await axios.post('api/token/verify/', { token: JSON.parse(localStorage.getItem('authToken'))['access'] });
				setIsAuthenticated(response.status === 200);
				return (response.status === 200);
			} catch (error) {
				console.error('error:', error);
				setIsAuthenticated(false);
			}
		};
		checkAuthentication();
	}, []);
	if (isAuthenticated === null)
		return null;
	return (isAuthenticated ? children : <Navigate to='/login' />);
}

const App = () => {
	return (
		<div className='page-container page-color page-font'>
			<BrowserRouter>
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/signup" element={<SignUpPage />} />
					<Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
					<Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
					<Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
					<Route path="/chats" element={<PrivateRoute><ChatsPage /></PrivateRoute>} />
					<Route path="/about" element={<PrivateRoute><AboutPage /></PrivateRoute>} />
				</Routes>
			</BrowserRouter>
		</div>
	);
}

export default App;
