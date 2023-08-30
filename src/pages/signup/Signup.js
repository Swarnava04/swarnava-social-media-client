import React, { useState } from "react";
import "./Signup.scss";
import { Link } from "react-router-dom";
import { axiosClient } from "../../utils/axiosClient";
function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const result = await axiosClient.post("/auth/signup", {
        name,
        email,
        password,
      });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="Signup">
      <div className="signup-box">
        <h2 className="heading">Signup</h2>
        <form action="" onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="name"
            className="name"
            id="name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="submit"
            value="submit"
            className="submit"
            onClick={handleSubmit}
          />
          <p>
            Already have an account <Link to={"/login"}>Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
