import "./Kanban.css";
import { RiDeleteBin2Line } from "react-icons/ri";
import KanbanBoard from "./KanbanBoard.js";
import TaskModal from "./TaskModal.js";
import MemberModal from "./MemberModal.js";
import useKanbanTasks from "./Hooks/useKanbanTask.js";
import { FaPlus } from "react-icons/fa";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { getCurrentUser } from "../../utils/auth.js";
import type { Task, EnrichedTask } from "../../types/task.js";
import type { ProjectOwner } from "../../types/project.js";

type CardMode = null | "create" | "edit" | "memberCreate";

export default function Kanban() {
  const [cardMode, setCardMode] = useState<CardMode>(null);
  const [activeTask, setActiveTask] = useState<EnrichedTask | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<string>("To Do");
  const [projectOwner, setProjectOwner] = useState<ProjectOwner | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assignee, setAssignee] = useState<string>("");
  const [memberEmail, setMemberEmail] = useState<string>("");

  const { projectId } = useParams<{ projectId: string }>();
  const currentUser = getCurrentUser();

  const {
    columns,
    members,
    displayMembers,
    isOwner,
    isLoading,
    createNewTask,
    updateExistingTask,
    deleteExistingTask,
    addNewMember,
    removeMember,
  } = useKanbanTasks(projectId ?? "");

  function createCard() {
    setCardMode("create");
    setActiveTask(null);
    setTitle("");
    setDescription("");
    setStatus("To Do");
    setAssignee("");
  }

  function editCard(task: EnrichedTask) {
    setCardMode("edit");
    setActiveTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    // Pre-select current assignee by user ID, or empty if unassigned
    setAssignee(String(task.assigned_to ?? ""));
  }

  function closeCard() {
    setCardMode(null);
    setActiveTask(null);
  }

  function createMemberCard() {
    setMemberEmail("");
    setCardMode("memberCreate");
  }

  return (
    <>
      <div className="home-container">
        <div className="home-header">
          <div className="header-left">
            <h1>My Tasks</h1>
            <p>
              {columns.reduce((total, col) => total + col.count, 0)}{" "}
              {columns.reduce((total, col) => total + col.count, 0) === 1
                ? "task"
                : "tasks"}{" "}
              in total
            </p>
          </div>
          <button className="create-project-btn" onClick={createCard}>
            <FaPlus />
            <span>Create New Task</span>
          </button>
        </div>
      </div>

      <KanbanBoard
        columns={columns}
        projectId={projectId!}
        onTasksUpdate={setTasks}
        onTaskClick={editCard}
      />

      <div className="home-container">
        <div className="home-header">
          <div className="home-left">
            <h1>Team members</h1>
            <p>
              {members.length} {members.length === 1 ? "member" : "members"} on
              this project
            </p>
          </div>
          {isOwner && (
            <button className="create-project-btn" onClick={createMemberCard}>
              <FaPlus />
              <span>Add member</span>
            </button>
          )}
        </div>
      </div>

      <div className="kanban-container">
        <div className="members-grid">
          {displayMembers.map((member) => {
            const isMemberOwner =
              projectOwner && member.user_id === projectOwner.user_id;
            const isYou = currentUser && member.user_id === currentUser.id;

            return (
              <div key={member.user_id} className="member-card">
                <div className="member-header">
                  <h3 className="member-name">
                    {member.name}
                    {isYou ? " (You)" : ""}
                  </h3>
                  {isOwner && !isMemberOwner && (
                    <RiDeleteBin2Line
                      className="bin-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMember(member.user_id);
                      }}
                    />
                  )}
                </div>
                <p className="member-role">
                  {isMemberOwner ? "Owner" : "Team Member"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {(cardMode === "create" || cardMode === "edit") && (
        <TaskModal
          mode={cardMode}
          task={activeTask}
          members={displayMembers}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          status={status}
          setStatus={setStatus}
          assignee={assignee}
          setAssignee={setAssignee}
          onSave={() => {
            if (cardMode === "edit" && activeTask) {
              updateExistingTask({
                activeTask,
                title,
                description,
                status,
                assignee,
              });
            } else {
              createNewTask({
                title,
                description,
              });
            }

            closeCard();
          }}
          onDelete={() => {
            if (activeTask) {
              deleteExistingTask(activeTask.id);
              closeCard();
            }
          }}
          onClose={closeCard}
          isLoading={isLoading}
        />
      )}

      {cardMode === "memberCreate" && (
        <MemberModal
          memberEmail={memberEmail}
          setMemberEmail={setMemberEmail}
          onSave={() => addNewMember(memberEmail)}
          onClose={closeCard}
          isLoading={isLoading}
        />
      )}
    </>
  );
}
