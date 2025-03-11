import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // we use this to navigate to another page after signup

const SignUpPage = () => {
  // setting up state variables for the form inputs
  const [email, setEmail] = useState(""); // email input
  const [password, setPassword] = useState(""); // password input
  const [confirmPassword, setConfirmPassword] = useState(""); // to confirm the password
  const [fullName, setFullName] = useState(""); // optional, the user's full name

  const navigate = useNavigate(); // hook to handle navigation after submitting the form

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page from refreshing when we submit the form

    // just logging to check the values (this will be replaced with actual backend logic later)
    console.log("signing up with:", email, password, fullName);

    // checking if the passwords match
    if (password !== confirmPassword) {
      alert("passwords don't match! please try again."); // if they don't match, show a message
      return; // exit the function if the passwords don't match
    }

    // TODO: send signup info to the backend to create the account and link it to SugarMate
    // (this is where you would make an API call to your backend)

    // once signup is successful, navigate to the homepage or another page (like a dashboard)
    navigate("/"); // this will redirect to the home page after successful signup
  };

  return (
    <div className="signup-container">
      <h2>sign up</h2>
      <p>note: make sure your details match your sugarmate account to sync your data properly.</p>
      <form onSubmit={handleSubmit}>
        {/* input for full name */}
        <input
          type="text"
          placeholder="full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)} // update state when the user types
          required // this field is required
        />
        {/* input for email */}
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // update state when the user types
          required // this field is required
        />
        {/* input for password */}
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // update state when the user types
          required // this field is required
        />
        {/* input for confirming password */}
        <input
          type="password"
          placeholder="confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} // update state when the user types
          required // this field is required
        />
        {/* the button to submit the form */}
        <button type="submit">sign up</button>
      </form>

      {/* just showing the values for debugging purposes */}
      <p>email: {email}</p>
      <p>full name: {fullName}</p>
      <p>password: {password}</p>
    </div>
  );
};

export default SignUpPage;
