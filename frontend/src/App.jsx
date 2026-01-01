import "./styles/global.css";
import Header from "./components/Header/Header.jsx";
import Register from "./pages/Register/Register.jsx";
import Footer from "./components/Footer/Footer.jsx";

export default function App() {
  return (
    <>
      <Header
        title="ProjectHub"
        subtitle="Track and manage your project tasks"
        // showBack
        // action={<button>+ Add Task</button>}
      />
      <Register />
      <Footer />
    </>
  );
}
