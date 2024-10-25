
import "./App.css";
import { useState } from "react";
function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const handleChanges = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email </label>
        <input
          type="email"
          required
          name="email"
          placeholder="user@gmail.com"
          onChange={handleChanges}
          value={values.email}
        />
        <br />
        <br />

        <label htmlFor="password">Password </label>
        <input
          type="password"
          required
          name="password"
          onChange={handleChanges}
          value={values.password}
        />
        <br />
        <br />

        <button type="submit">Submit </button>
      </form>
    </div>
  );
  }
  export default Login