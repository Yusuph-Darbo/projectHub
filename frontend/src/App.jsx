import Header from "./components/Header/Header.jsx";
import Register from "./pages/Register.jsx";

function App() {
  return (
    <>
      {/* <Header 
        title="Website Redesign Project"
        subtitle="Track and manage your project tasks"
        showBack
        action={<button>+ Add Task</button>}
      /> */}
      <Register />
    </>
  );
}

export default App;
