import { Routes, Route } from "react-router-dom";

import "./styles/global.css";

import Header from "./components/Header/Header.jsx";
import Register from "./pages/Register/Register.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Home from "./pages/Home/Home.jsx";
import Kanban from "./pages/Kanban/Kanban.jsx";

export default function App() {
  return (
    <>
      <Header
        title="ProjectHub"
        subtitle="Track and manage your project tasks"
        // showBack
        action={<button>+ Add Task</button>}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Kanban />} />
      </Routes>

      <Footer />
    </>
  );
}
