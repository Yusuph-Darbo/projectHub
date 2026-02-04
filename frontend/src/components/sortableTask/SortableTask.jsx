import { useSortable } from "@dnd-kit/sortable";
import { AiOutlineHolder } from "react-icons/ai";
import "./SortableTask.css";

export function SortableTask({ task, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  return (
    <button
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task-card"
      onClick={onClick}
    >
      <div className="task-header">
        <AiOutlineHolder className="task-icon" />
        <h3 className="task-title">{task.title}</h3>
      </div>

      <p className="task-description">{task.description}</p>

      <div className="task-footer">
        <span className="task-status">{task.status}</span>
      </div>
    </button>
  );
}
