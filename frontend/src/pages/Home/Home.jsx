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
import { listProjects } from "../../utils/api.js";
import { formatDistanceToNow } from "date-fns";
import { createProject } from "../../utils/api.js";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
  // Form states
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cardMode, setCardMode] = useState(null);
  const [activeProject, setActiveProject] = useState(null);

  const navigate = useNavigate();

  // Projects for user from db
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function loadProjects() {
      try {
        const data = await listProjects();
        setProjects(data);
      } catch (err) {
        console.error("Failed to load projects", err.message);
      }
    }

    loadProjects();
  }, []);

  async function handleCreateProject() {
    if (!projectName.trim() || !projectDescription.trim()) return;

    try {
      setIsLoading(true);

      const newProject = await createProject({
        name: projectName,
        description: projectDescription,
      });

      setProjects((prev) => [newProject, ...prev]);

      // Reset & close
      setProjectName("");
      setProjectDescription("");
      closeCard();
    } catch (err) {
      console.error("Failed to create project:", err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function createCard() {
    setCardMode("create");
    setActiveProject(null);
  }

  function editCard(project) {
    setCardMode("edit");
    setActiveProject(project);
    setProjectName(project.name);
    setProjectDescription(project.description);
  }

  function closeCard() {
    setCardMode(null);
    setActiveProject(null);
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
        <button className="create-project-btn" onClick={createCard}>
          <FaPlus />
          <span>Create New Project</span>
        </button>
      </div>

      {cardMode && (
        <>
          <div className="modal-overlay" onClick={closeCard}></div>
          <Card className="create-project-card">
            <CardHeader>
              {cardMode === "create" && (
                <>
                  <CardTitle>Create New Project</CardTitle>
                  <CardDescription>
                    create a new project. Give it a name and description to get
                    started.
                  </CardDescription>
                </>
              )}

              {cardMode === "edit" && activeProject && (
                <>
                  <CardTitle>Edit Project</CardTitle>
                  <CardDescription>
                    Update the project details below.
                  </CardDescription>
                </>
              )}
              <CardAction>
                <button
                  className="close-btn"
                  onClick={closeCard}
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
              <button className="btn-cancel" onClick={closeCard}>
                Cancel
              </button>
              <button
                className="btn-create"
                onClick={
                  cardMode === "edit"
                    ? handleUpdateProject
                    : handleCreateProject
                }
                disabled={isLoading}
              >
                {isLoading
                  ? "Saving..."
                  : cardMode === "edit"
                  ? "Update Project"
                  : "Create Project"}
              </button>
            </CardFooter>
          </Card>
        </>
      )}

      <div className="projects-grid">
        {projects.map((project) => (
          <button
            key={project.project_id}
            className="project-card"
            onClick={() => editCard(project)}
            onDoubleClick={() => {
              navigate("/dashboard");
            }}
          >
            <h2 className="project-title">{project.name}</h2>
            <p className="project-description">{project.description}</p>
            <div className="project-timestamp">
              <FaClock />
              <span>
                {formatDistanceToNow(new Date(project.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </button>
        ))}
      </div>
    </main>
  );
}
