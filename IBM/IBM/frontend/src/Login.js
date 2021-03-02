import React, { useState } from "react";
import axios from "axios";
import { setUserSession } from "./Utils/Common";


function Login(props) {
	const [loading, setLoading] = useState(false);
	const username = useFormInput("");
	const password = useFormInput("");
	const [error, setError] = useState(null);
	const user_type = useFormInput("");

	// handle button click of login form
	const handleLogin = () => {
		setError(null);
		setLoading(true);
		axios
			.post("http://localhost:4000/users/signin", {
				username: username.value,
				password: password.value,
				user_type :user_type.value,
			})
			.then((response) => {
				setLoading(false);
				setUserSession(response.data.token, response.data.user);
				props.history.push("/dashboard");
			})
			.catch((error) => {
				setLoading(false);
				if (error.response.status === 401)
					setError(error.response.data.message);
				else setError("Something went wrong. Please try again later.");
			});
	};

	return (
		<div style={{ textAlign: "center" }}>
			<strong>Smart Kaksha</strong>
			<br />
			<br />
			<div style={{ fontSize: 56 }}>Login</div>
			<br />
			<div>
				Username
				<br />
				<input type="text" {...username} autoComplete="new-password" />
			</div>
			<div style={{ marginTop: 10 }}>
				Password
				<br />
				<input type="password" {...password} autoComplete="new-password" />
				<br />
			</div>

			<div>
				<br />
				<input
					name="user_type"
					type="radio"
					{...user_type}
					value="student"

					//onclick={() => Set_type("student")}
				/>
				<label>Student</label>

				<input
					name="user_type"
					type="radio"
					{...user_type}
					value="teacher"
					
				/>
				<label>Teacher</label>
			</div>
			{error && (
				<>
					<small style={{ color: "red" }}>{error}</small>
					<br />
				</>
			)}
			<br />
			<input
				type="button"
				value={loading ? "Loading..." : "Login"}
				onClick={handleLogin}
				disabled={loading}
			/>
			<br />
		</div>

	);
}

  const useFormInput = (initialValue) => {
	const [value, setValue] = useState(initialValue);

	const handleChange = (e) => {
		setValue(e.target.value);
	};
	return {
		value,
		onChange: handleChange,
	};
};

export default Login;