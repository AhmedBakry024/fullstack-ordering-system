import "./App.css";
import { useState } from "react";

function Register() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
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
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name </label>
        <input
          type="text"
          required
          name="name"
          placeholder="user"
          onChange={handleChanges}
          value={values.name}
        />
        <br />
        <br />

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

        <label htmlFor="phone">Phone </label>
        <input
          type="text"
          required
          name="phone"
          onChange={handleChanges}
          value={values.phone}
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

export default Register;
