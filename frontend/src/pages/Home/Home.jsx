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
import { createProject } from "../../utils/api.js";
import { useState } from "react";

export default function Home() {
  // Form states
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  async function handleCreateProject() {
    if (!projectName.trim() || !projectDescription.trim()) return;

    try {
      setIsLoading(true);

      const newProject = await createProject({
        name: projectName,
        description: projectDescription,
      });

      // TODO: add project to state instead of mock data

      // Reset & close
      setProjectName("");
      setProjectDescription("");
      setShowCard(false);
    } catch (err) {
      console.error("Failed to create project:", error.message);
    } finally {
      setIsLoading(false);
    }
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
        <>
          <div className="modal-overlay" onClick={handleClick}></div>
          <Card className="create-project-card">
            <CardHeader>
              <CardTitle>Create New Project</CardTitle>
              <CardDescription>
                Add a new project to your dashboard. Give it a name and
                description to get started.
              </CardDescription>
              <CardAction>
                <button
                  className="close-btn"
                  onClick={handleClick}
                  aria-label="Close modal"
                >
                  ×
                </button>
              </CardAction>
            </CardHeader>

            <CardContent>
              <div className="form-group">
                <label htmlFor="project-name">Project Name</label>
                <input
                  type="text"
                  id="project-name"
                  placeholder="Enter project name"
                  className="form-input"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="project-description">Description</label>
                <textarea
                  id="project-description"
                  placeholder="Enter project description"
                  className="form-textarea"
                  rows="4"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter>
              <button className="btn-cancel" onClick={handleClick}>
                Cancel
              </button>
              <button
                className="btn-create"
                onClick={handleCreateProject}
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Project"}
              </button>
            </CardFooter>
          </Card>
        </>
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
