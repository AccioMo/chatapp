import { createContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import SideBar from "./components/SideBar.jsx";
import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";
import Home from "./components/Home";
import ChatPage from "./components/ChatPage";
import AboutPage from "./components/AboutPage.jsx";
import SignUpPage from "./components/SignUpPage.jsx";
import CommonChatsPage from "./components/CommonChatsPage.jsx";
import { Navigate } from "react-router";
import { getCookie, validCookie } from "./components/Cookies.jsx";
import { api, refreshToken, verifyToken, AuthContext } from "./components/Auth.tsx";
import "./styles/App.css";

const App = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [currentUser, setCurrentUser] = useState(null);
	useEffect(() => {
		const checkAuthentication = async () => {
			let access_token = getCookie("access_token");
			if (!access_token || access_token === "") {
				setIsAuthenticated(false);
				return false;
			}
			console.log("access_token: ", access_token);
			if (validCookie(access_token) === false) {
				access_token = await refreshToken();
			}
			const response = await verifyToken(access_token);
			setIsAuthenticated(response.status === 200);
			if (response.status === 200) {
				setCurrentUser(getCookie("user"));
				if (!currentUser) {
					const headers = {
						Authorization: `Bearer ${access_token}`,
					};
					const user = await api.get("/api/auth", { headers });
					setCurrentUser(user.data);
				}
			}
			return response.status === 200;
		};
		checkAuthentication()
			.then(() => setIsLoading(false))
			.catch((e) => console.error("error:", e));
	}, [isAuthenticated]);
	if (isLoading) {
		return <div>Loading...</div>;
	} else if (!isAuthenticated) {
		return (
			<div className="large-container page-color page-font">
				<BrowserRouter>
					<AuthContext.Provider
						value={{ isAuthenticated, setIsAuthenticated }}
					>
						<Routes>
							<Route
								path="/*"
								element={<Navigate to="/login" />}
							/>
							<Route path="/login" element={<LoginPage />} />
							<Route path="/signup" element={<SignUpPage />} />
						</Routes>
					</AuthContext.Provider>
				</BrowserRouter>
			</div>
		);
	}
	return (
		<div className="large-container page-color page-font">
			<BrowserRouter>
				<AuthContext.Provider
					value={{ isAuthenticated, setIsAuthenticated }}
				>
					<div className="page-container page-font">
						<SideBar my_user={currentUser} />
						<div className="page-content-container">
							<NavBar />
							<Routes>
								<Route
									path="/*"
									element={<Navigate to="/home" />}
								/>
								<Route path="/home" element={<Home />} />
								<Route
									path="/profile"
									element={<ProfilePage />}
								/>
								<Route path="/about" element={<AboutPage />} />
								<Route path="/chats" element={<ChatPage />} />
								<Route
									path="/chat/:chat_id"
									element={<ChatPage />}
								/>
								<Route
									path="/users/:username"
									element={<CommonChatsPage />}
								/>
							</Routes>
						</div>
					</div>
				</AuthContext.Provider>
			</BrowserRouter>
		</div>
	);
};

export default App;
