import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.jsx";
import type { EnrichedTask } from "../../types/task.js";
import type { Member } from "../../types/projectAssignment.js";

interface TaskModalProps {
  mode: "create" | "edit";
  task?: EnrichedTask | null;
  members: Member[];
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  assignee: string;
  setAssignee: (v: string) => void;
  onSave: () => void;
  onDelete?: () => void;
  onClose: () => void;
  isLoading: boolean;
}

export default function TaskModal({
  mode,
  task,
  members,
  title,
  setTitle,
  description,
  setDescription,
  status,
  setStatus,
  assignee,
  setAssignee,
  onSave,
  onDelete,
  onClose,
  isLoading,
}: TaskModalProps) {
  const isFormValid = title.trim().length > 0 && description.trim().length > 0;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <Card className="create-task-card">
        <CardHeader>
          {mode === "create" ? (
            <>
              <CardTitle>Create New Task</CardTitle>
              <CardDescription>
                Add a new task to your project. Give it a name and description
                to get started.
              </CardDescription>
            </>
          ) : (
            <>
              <CardTitle>Edit Task</CardTitle>
              <CardDescription>Update the task details below.</CardDescription>
            </>
          )}
          <CardAction>
            <button
              className="close-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
              ×
            </button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <div className="form-group">
            <label htmlFor="task-name">Task Name</label>
            <input
              type="text"
              id="task-name"
              placeholder="Enter task name"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              placeholder="Enter task description"
              className="form-textarea"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {mode === "edit" && (
            <div className="form-group">
              <label htmlFor="task-status">Status</label>
              <select
                id="task-status"
                className="form-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>

              <label htmlFor="task-assignment">Assign member to task</label>
              <select
                id="task-assignment"
                className="form-status"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              >
                <option value="">Unassigned</option>
                {members.map((member) => (
                  <option key={member.user_id} value={member.user_id}>
                    {member.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </CardContent>

        <CardFooter>
          {mode === "edit" && task && onDelete && (
            <button className="btn-delete" onClick={onDelete}>
              Delete task
            </button>
          )}
          <div>
            <button className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn-create"
              disabled={!isFormValid}
              onClick={onSave}
            >
              {isLoading
                ? "Saving..."
                : mode === "edit"
                  ? "Update Task"
                  : "Create Task"}
            </button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
