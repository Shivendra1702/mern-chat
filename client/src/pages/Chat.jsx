import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BsSend } from "react-icons/bs";
import { GrAttachment } from "react-icons/gr";

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

  useEffect(() => {
    const wsc = new WebSocket(`ws://127.0.0.1:4000`);
    wsc.addEventListener("message", handleMessage);
  }, []);

  const handleMessage = (e) => {
    const messageData = e;
    console.log(messageData.data);
   
  };

  const navigate = useNavigate();

  if (!user?.username) navigate("/login");

  return (
    <div className="chat_wrapper">
      <div className="contacts">Contacts</div>
      <div className="messages">
        <div className="selected_contact"></div>
        <div className="form">
          <div className="options">
            <GrAttachment />
          </div>
          <input
            className="message_input"
            type="text"
            placeholder="Type a message "
          />
          <button className="send_message">
            <BsSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
