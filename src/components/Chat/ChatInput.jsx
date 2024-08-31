import { useEffect, useState } from "react";

function ChatInput({ onSend }) {
	const [value, setValue] = useState("");
	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			const message = event.target.value;
			if (message === "") return;
			setValue("");
			onSend(message);
		}
	};
	useEffect(() => {
		const textarea = document.querySelector(".input-box");
		const defaultHeight = "4rem";
		textarea.style.height = defaultHeight; // Set the default height

		const adjustHeight = () => {
			textarea.style.height = defaultHeight; // Reset the height
			textarea.style.height = textarea.scrollHeight + "px"; // Set the height to the scroll height
		};
		textarea.addEventListener("input", adjustHeight);
		return () => {
			textarea.removeEventListener("input", adjustHeight);
		};
	}, []);
	return (
		<div className="container-of-container">
			<div className="input-container">
				<textarea
					className="input-box"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Type a message..."
				/>
			</div>
			<div className="send-button-container">
				<button
					className="send-button"
					onClick={() => {
						if (value === "") return;
						onSend(value);
						setValue("");
					}}
				>
					Send
				</button>
			</div>
		</div>
	);
}

export default ChatInput;
