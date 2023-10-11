import Register from "./pages/Register";
import { Route, Routes } from "react-router-dom";
import "./App.scss";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import { UserProvider } from "./UserContext.jsx";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route index path="/" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
