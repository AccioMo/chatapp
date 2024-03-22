import { React, useState, useEffect} from 'react'
import { useNavigate } from 'react-router';
import NavBar from './NavBar.jsx';
import PocketBase from 'pocketbase';
import ChatContainer from './ChatContainer.jsx';
import axios from 'axios';
import '../styles/Home.css';

const Home = () => {
	const pb = new PocketBase('http://127.0.0.1:8090');
	const nav = useNavigate();
	const [chats, setChats] = useState(null);
	useEffect(() => {
		// let ignore = false;
		const getChats = async () => {
			try {
				const token = localStorage.getItem('jwt_token');
				const headers = {
					'Authorization': `Bearer ${token}`
				};
				const chats = await axios.get('/api/chats/', { headers });
				console.log(chats.data); // logs the chats
				return (chats.data);
			} catch (error) {
				console.error("error: ", error); // logs any error that occurred
				// throw error;
			}
		}
		// const chats = getChats();
		// 	setChats(null);
		getChats().then(chats => {
			// if (ignore) return;
			// console.log("chats:", chats); // logs the chats
			setChats(chats);
		});
		
			//     return () => {
			// 		ignore = true;
			// };
		}, []);
	// if (pb.authStore.isValid === false) {
	// 	nav('/login');
	// 	return null;
	// }
	return (
		<>
			<NavBar />
			<div className='home-container'>
				<h1 className='welcome-header'>landing page</h1>
				<div className='chats-container'>
					{
						chats ? chats.map(chat => (
							<ChatContainer key={chat.id} chat={chat} />
						)):null
					}
				</div>
			</div>
		</>
		// <GoogleOAuthProvider clientId={UIDD} >
		// 	<div>
		// 		<div className="input-field">
		// 			<googleLogout 
		// 			onLogoutSuccess={() => nav('/')}
		// 			></googleLogout>
		// 		</div>
		// 	</div>
		// </GoogleOAuthProvider>
	)
}

export default Home