import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { BsSend } from "react-icons/bs";
import { GrAttachment } from "react-icons/gr";
import { UserContext } from "../UserContext";

const Chat = () => {
  const [onlinePeople, setOnlinePeople] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const { userDetail, setUserDetail } = useContext(UserContext);
  const [newMessage, setNewMessage] = useState("");
  const [wss, setWss] = useState(null);
  const [messages, setMessages] = useState([]);

  const navigate = useNavigate();
  const colors = [
    "bg-teal-300",
    "bg-red-300",
    "bg-green-300",
    "bg-purple-300",
    "bg-blue-300",
    "bg-yellow-300",
    "bg-orange-300",
    "bg-pink-300",
    "bg-fuchsia-300",
    "bg-rose-300",
  ];

  const showOnlineUsers = (peopleArray) => {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  };
  const handleMessage = (e) => {
    const messageData = JSON.parse(e.data);
    if ("online" in messageData) {
      showOnlineUsers(messageData.online);
    } else {
      console.log(e);
    }
  };
  useEffect(() => {
    const wsc = new WebSocket(`ws://127.0.0.1:4000`);
    wsc.addEventListener("message", handleMessage);
    setWss(wsc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    fetch(`http://127.0.0.1:4000/api/v1/logout`, {
      credentials: "include",
      method: "GET",
    })
      .then((response) => {
        if (response.ok) {
          setUserDetail(null);
          navigate("/");
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    wss.send(
      JSON.stringify({
        recipient: selectedUser,
        message: newMessage,
      })
    );
    setNewMessage("");
    setMessages((prev) => [...prev, { message: newMessage, isOur: true }]);
    console.log(messages);
  };

  const onlinePeopleExclOurUser = { ...onlinePeople };
  delete onlinePeopleExclOurUser[userDetail?._id];

  return (
    <div className="chat_wrapper">
      <div className="contacts">
        <div className="chat_header">
          <h1>Chats</h1>
          <button onClick={handleLogout}>Logout</button>
        </div>
        <div className="contacts_list">
          {Object.keys(onlinePeopleExclOurUser).map((userId) => {
            return (
              <div
                key={userId}
                className={
                  "single_user " + (selectedUser === userId ? "active" : "")
                }
                onClick={() => {
                  setSelectedUser(userId);
                }}
              >
                <div
                  className={`avatar ${
                    colors[parseInt(userId.substring(10), 16) % colors.length]
                  }`}
                >
                  {onlinePeople[userId][0]}
                </div>
                {onlinePeople[userId]}
              </div>
            );
          })}
        </div>
      </div>
      <div className="messages">
        {!selectedUser ? (
          <div className="no_user_selected">
            <h1>Please Select a Person to Chat ...</h1>
          </div>
        ) : (
          <>
            <div className="selected_contact_header">
              <div
                className={`avatar ${
                  colors[
                    parseInt(selectedUser.substring(10), 16) % colors.length
                  ]
                }`}
              >
                {onlinePeople[selectedUser][0]}
              </div>
              <h1>{onlinePeople[selectedUser]}</h1>
            </div>
            <div className="selected_contact"></div>
            <form className="form" onSubmit={handleSubmit}>
              <div className="options">
                <GrAttachment />
              </div>
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="message_input"
                type="text"
                placeholder="Type a message "
              />
              <button className="send_message" type="submit">
                <BsSend />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
