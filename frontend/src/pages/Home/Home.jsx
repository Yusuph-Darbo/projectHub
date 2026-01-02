import "../../styles/global.css";
import "./Home.css";
import { FaPlus, FaClock } from "react-icons/fa";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.jsx";
import { useState } from "react";

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

  const [showCard, setShowCard] = useState(false);

  function handleClick() {
    setShowCard((prev) => !prev);
  }

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
        <button className="create-project-btn" onClick={handleClick}>
          <FaPlus />
          <span>Create New Project</span>
        </button>
      </div>

      {showCard && (
        <Card className="create-project-card">
          <CardHeader>
            <CardTitle>New Project</CardTitle>
            <CardDescription>Create a new project</CardDescription>
            <CardAction>X</CardAction>
          </CardHeader>

          <CardContent>
            <p>Card Content</p>
          </CardContent>

          <CardFooter>
            <button onClick={() => setShowCard(false)}>Close</button>
          </CardFooter>
        </Card>
      )}

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
