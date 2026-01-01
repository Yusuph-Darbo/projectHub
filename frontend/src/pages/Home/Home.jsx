import "../../styles/global.css";
import "./Home.css";
import { FaPlus, FaClock } from "react-icons/fa";

export default function Home() {
  // Mock data
  const projects = [
    {
      title: "Website Redesign",
      description:
        "Complete overhaul of the company website with modern design and improved UX",
      timeAgo: "2 hours ago",
    },
    {
      title: "Mobile App Development",
      description: "Native mobile application for iOS and Android platforms",
      timeAgo: "1 day ago",
    },
    {
      title: "Marketing Campaign Q1",
      description:
        "Strategic marketing initiatives for the first quarter of 2024",
      timeAgo: "3 days ago",
    },
  ];

  return (
    <main className="home-container">
      <div className="home-header">
        <div className="header-left">
          <h1>My Projects</h1>
          <p>
            {projects.length} {projects.length === 1 ? "project" : "projects"}{" "}
            in total
          </p>
        </div>
        <button className="create-project-btn">
          <FaPlus />
          <span>Create New Project</span>
        </button>
      </div>

      <div className="projects-grid">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <h2 className="project-title">{project.title}</h2>
            <p className="project-description">{project.description}</p>
            <div className="project-timestamp">
              <FaClock />
              <span>{project.timeAgo}</span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
