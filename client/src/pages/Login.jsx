import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";

const Login = () => {
  const userDetail = useContext(UserContext);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://127.0.0.1:4000/api/v1/login`, {
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
          setUser({ email: "", password: "" });
          navigate("/");
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  useEffect(() => {
    if (userDetail?.username) navigate("/");
  }, [userDetail, navigate]);

  return (
    <div className="f_page">
      <div className="form_wrapper container">
        <h1 className="">Login</h1>
        <form action="" className="flex flex-col gap-4">
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
            Login
          </button>
        </form>
        <span>
          Not Yet Registered ! <Link to={`/register`}>Register</Link> Here
        </span>
      </div>
    </div>
  );
};

export default Login;
