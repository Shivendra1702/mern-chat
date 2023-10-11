import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch("http://127.0.0.1:4000/api/v1/profile", {
      credentials: "include",
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data.user);
      });
  }, []);

  const navigate = useNavigate();

  if (!user?.username) navigate("/login");

  return (
    <div className="chat_wrapper">
      <div className="contacts">Contacts</div>
      <div className="messages">
        <div className="selected_contact"></div>
        <div className="form"></div>
      </div>
    </div>
  );
};

export default Chat;
