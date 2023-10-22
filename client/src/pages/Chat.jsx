import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BsSend } from "react-icons/bs";
import { GrAttachment } from "react-icons/gr";
import { UserContext } from "../UserContext";
import { uniqBy } from "lodash";
// import { format } from "date-fns";

const Chat = () => {
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const { userDetail, setUserDetail } = useContext(UserContext);
  const [newMessage, setNewMessage] = useState("");
  const [wss, setWss] = useState(null);
  const [messages, setMessages] = useState([]);
  const messageRef = useRef(null);

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
      const msg_obj = JSON.parse(e.data);
      setMessages((prev) => [...prev, { ...msg_obj }]);
    }
  };

  useEffect(() => {
    function connectToWs() {
      const wsc = new WebSocket(`ws://127.0.0.1:4000`);
      wsc.addEventListener("message", handleMessage);
      wsc.addEventListener("close", () => {
        connectToWs();
      });
      setWss(wsc);
    }
    connectToWs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    fetch(`http://127.0.0.1:4000/api/v1/logout`, {
      credentials: "include",
      method: "GET",
    })
      .then((response) => {
        if (response.ok) {
          setWss(null);
          setUserDetail(null);
          navigate("/");
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (newMessage.length == 0) return;
    wss.send(
      JSON.stringify({
        receiver: selectedUser,
        message: newMessage,
      })
    );
    setNewMessage("");
    setMessages((prev) => [
      ...prev,
      {
        message: newMessage,
        sender: userDetail?._id,
        receiver: selectedUser,

        _id: Date.now(),
      },
    ]);
  };

  useEffect(() => {
    const div = messageRef.current;
    if (div) {
      div.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [messages]);

  useEffect(() => {
    if (selectedUser) {
      fetch(`http://127.0.0.1:4000/api/v1/messages/${selectedUser}`, {
        credentials: "include",
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data.messages);
          setMessages(data.messages);
        })
        .catch((err) => {
          throw new Error(err);
        });
    }
  }, [selectedUser]);

  useEffect(() => {
    fetch(`http://127.0.0.1:4000/api/v1/people`, {
      credentials: "include",
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        const offlineUsers = data.users
          .filter((user) => user._id !== userDetail?._id)
          .filter((user) => {
            return !Object.keys(onlinePeople).includes(user._id);
          });
        const offline = {};
        offlineUsers.forEach(({ _id, username }) => {
          offline[_id] = username;
        });
        setOfflinePeople(offline);
      })
      .catch((err) => {
        throw new Error(err);
      });
  }, [onlinePeople, userDetail?._id]);

  const onlinePeopleExclOurUser = { ...onlinePeople };
  delete onlinePeopleExclOurUser[userDetail?._id];

  const messagesWithoutDupes = uniqBy(messages, "_id");

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

                  <div className="online_logo"></div>
                </div>
                {onlinePeople[userId]}
              </div>
            );
          })}
          {Object.keys(offlinePeople).map((userId) => {
            return (
              <div
                key={userId}
                className={
                  "single_user " + (selectedUser === userId ? "active" : "")
                }
                onClick={() => {
                  setSelectedUser(userId);
                  console.log(userId);
                }}
              >
                <div
                  className={`avatar ${
                    colors[parseInt(userId.substring(10), 16) % colors.length]
                  }`}
                >
                  {offlinePeople[userId][0]}
                  <div className="offline_logo"></div>
                </div>

                {offlinePeople[userId]}
              </div>
            );
          })}
        </div>
        <div className="logged_person_name">
          <span>Logged In As : {userDetail?.username}</span>
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
                {onlinePeople[selectedUser] && onlinePeople[selectedUser][0]}
                {offlinePeople[selectedUser] && offlinePeople[selectedUser][0]}
              </div>
              <h1>
                {onlinePeople[selectedUser] && onlinePeople[selectedUser]}
                {offlinePeople[selectedUser] && offlinePeople[selectedUser]}
              </h1>
            </div>
            <div className="selected_contact">
              {messagesWithoutDupes.map((message, index) =>
                message.sender === userDetail?._id ? (
                  <div key={index} className=" sent_msg">
                    <div className="message sent">
                      <span>{message.message}</span>
                      {/* <br />
                      <time className="msg_time">
                        {format(
                          new Date(message.createdAt),
                          "MMM dd , yyyy hh:mm"
                        )}
                      </time> */}
                    </div>
                  </div>
                ) : (
                  <div key={index} className="">
                    <div className="message received">
                      <span>{message.message}</span>
                      {/* <br />
                      <time className="msg_time">
                        {format(
                          new Date(message.createdAt),
                          "MMM dd , yyyy hh:mm"
                        )}
                      </time> */}
                    </div>
                  </div>
                )
              )}
              <div ref={messageRef}></div>
            </div>
            <form className="form" onSubmit={handleSubmit}>
              <div className="options">
                <label htmlFor="file_input" className="cursor-pointer">
                  <GrAttachment />
                </label>
                <input type="file" className="hidden" id="file_input" />
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
