import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const Register = () => {
  const userDetail = useContext(UserContext);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:4000/api/v1/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.ok) {
          setUser({ username: "", email: "", password: "" });
          navigate("/");
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  if (userDetail?.username) navigate("/");

  return (
    <div className="f_page">
      <div className="form_wrapper container">
        <h1 className="">Register</h1>
        <form action="" className="flex flex-col gap-4">
          <input
            type="text"
            value={user.username}
            placeholder="Username"
            className=""
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />
          <input
            type="email"
            value={user.email}
            placeholder="Email"
            className=""
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          <input
            type="Password"
            value={user.password}
            placeholder="Password"
            className=""
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          <button className="" onClick={handleSubmit}>
            Register
          </button>
        </form>
        <span>
          Already a User ! <Link to={`/login`}>Login</Link> Here
        </span>
      </div>
    </div>
  );
};

export default Register;
