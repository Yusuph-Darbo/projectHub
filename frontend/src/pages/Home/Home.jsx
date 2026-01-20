import "./Home.css";
import { FaPlus, FaClock } from "react-icons/fa";
import { AiOutlineHolder } from "react-icons/ai";
import { FaFolder } from "react-icons/fa";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.jsx";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../../components/ui/empty.jsx";
import { deleteProject, editProject, listProjects } from "../../utils/api.js";
import { formatDistanceToNow } from "date-fns";
import { createProject } from "../../utils/api.js";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../../utils/auth.js";

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

  async function handleUpdateProject() {
    if (!projectName.trim() || !projectDescription.trim()) return;

    try {
      setIsLoading(true);

      const updatedProject = await editProject(activeProject.project_id, {
        name: projectName,
        description: projectDescription,
      });

      // Rendering the updated project list
      setProjects((prev) =>
        prev.map((p) =>
          p.project_id === activeProject.project_id ? updatedProject : p,
        ),
      );

      closeCard();
    } catch (err) {
      console.error("Failed to edit project:", err.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Cannot delete a project if it has tasks, probably have to inclcude delete cascade in the db
  async function handleDeleteProject() {
    try {
      setIsLoading(true);

      await deleteProject(activeProject.project_id);

      // Filtering out the deleted project
      setProjects((prev) =>
        prev.filter((p) => p.project_id !== activeProject.project_id),
      );

      closeCard();
    } catch (err) {
      console.error("Failed to delete project:", err.message);
    } finally {
      setIsLoading(false);
    }
  }

  function createCard() {
    setCardMode("create");
    setActiveProject(null);
    setProjectName("");
    setProjectDescription("");
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

  // When creating a form checking if the user has inputted text
  const isFormValid =
    projectName.trim().length > 0 && projectDescription.trim().length > 0;

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
        <button
          className="create-project-btn"
          onClick={createCard}
          disabled={!isAuthenticated()}
        >
          <FaPlus />
          <span>Create New Project</span>
        </button>
      </div>

      {/* user IS logged in AND has NO projects */}
      {isAuthenticated() && projects.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FaFolder />
            </EmptyMedia>
            <EmptyTitle>No Projects Yet</EmptyTitle>
            <EmptyDescription>
              You haven't created any projects yet. Get started by creating your
              first project.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {/* user is NOT logged in*/}
      {!isAuthenticated() && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FaFolder />
            </EmptyMedia>
            <EmptyTitle>You are not logged in</EmptyTitle>
            <EmptyDescription>
              Please log in to your account or register an account
              <a href="/register"> here</a>.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

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
              {cardMode === "edit" && activeProject && (
                <button className="btn-delete" onClick={handleDeleteProject}>
                  Delete task
                </button>
              )}
              <div>
                <button className="btn-cancel" onClick={closeCard}>
                  Cancel
                </button>
                <button
                  className="btn-create"
                  disabled={!isFormValid}
                  onClick={
                    cardMode === "edit"
                      ? handleUpdateProject
                      : handleCreateProject
                  }
                >
                  {isLoading
                    ? "Saving..."
                    : cardMode === "edit"
                      ? "Update Project"
                      : "Create Project"}
                </button>
              </div>
            </CardFooter>
          </Card>
        </>
      )}

      <div className="projects-grid">
        {projects.map((project) => (
          <button
            key={project.project_id}
            className="project-card"
            onClick={() => {
              navigate(`/dashboard/${project.project_id}`);
            }}
          >
            <div className="project-header">
              <AiOutlineHolder
                className="project-icon"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent button click
                  editCard(project);
                }}
              />
              <h2 className="project-title">{project.name}</h2>
            </div>
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
