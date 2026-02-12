import { AiOutlineHolder } from "react-icons/ai";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { toast } from "sonner";
import { useState } from "react";
import { editTaskStatus, getProjectTasks } from "../../utils/api.js";
import type { EnrichedTask, Task } from "../../types/task.js";

interface ColumnConfig {
  id: string;
  title: string;
  bgColor: string;
  borderColor: string;
  statusColor: string;
  statusTextColor: string;
}

export interface Column extends ColumnConfig {
  tasks: EnrichedTask[];
  count: number;
}

interface KanbanBoardProps {
  columns: Column[];
  projectId: string;
  onTasksUpdate: (tasks: Task[]) => void;
  onTaskClick: (task: EnrichedTask) => void;
}

interface DroppableColumnProps {
  column: Column;
  children: React.ReactNode;
}

interface SortableTaskProps {
  task: EnrichedTask;
  borderColor: string;
  onTaskClick: (task: EnrichedTask) => void;
}

interface TaskCardProps {
  task: EnrichedTask;
  borderColor: string;
}

function DroppableColumn({ column, children }: DroppableColumnProps) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: "column",
      status: column.title,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className="kanban-column"
      style={{
        backgroundColor: column.bgColor,
        border: `2px solid ${column.borderColor}`,
      }}
    >
      {children}
    </div>
  );
}

function SortableTask({ task, borderColor, onTaskClick }: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <button
      className="task-card"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onTaskClick(task)}
    >
      <div className="task-header">
        <AiOutlineHolder className="task-icon" />
        <h3 className="task-title">{task.title}</h3>
      </div>

      <p className="task-description">{task.description}</p>

      <div className="task-footer">
        <div className="task-status-row">
          <span
            className="task-status"
            style={{
              backgroundColor: task.statusColor,
              color: task.statusTextColor,
              border: `1px solid ${borderColor}`,
            }}
          >
            {task.status}
          </span>
        </div>

        <div className="task-meta">
          <p>Created by: {task.createdByLabel}</p>
          {task.assignedToLabel !== "Unassigned" && (
            <p className="task-assignee">Assigned to: {task.assignedToLabel}</p>
          )}
        </div>
      </div>
    </button>
  );
}

function TaskCard({ task, borderColor }: TaskCardProps) {
  return (
    <div className="task-card" style={{ cursor: "grabbing" }}>
      <div className="task-header">
        <AiOutlineHolder className="task-icon" />
        <h3 className="task-title">{task.title}</h3>
      </div>

      <p className="task-description">{task.description}</p>

      <div className="task-footer">
        <div className="task-status-row">
          <span
            className="task-status"
            style={{
              backgroundColor: task.statusColor,
              color: task.statusTextColor,
              border: `1px solid ${borderColor}`,
            }}
          >
            {task.status}
          </span>
        </div>

        <div className="task-meta">
          <p>Created by: {task.createdByLabel}</p>
          {task.assignedToLabel !== "Unassigned" && (
            <p className="task-assignee">Assigned to: {task.assignedToLabel}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Lookup for column border color by status title (used for DragOverlay)
const columnBorderByStatus: Record<string, string> = {
  "To Do": "#CAD5E2",
  "In Progress": "#8EC5FF",
  Done: "#7AF1A8",
};

export default function KanbanBoard({
  columns,
  projectId,
  onTasksUpdate,
  onTaskClick,
}: KanbanBoardProps) {
  const [activeDragTask, setActiveDragTask] = useState<EnrichedTask | null>(
    null,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  function handleDragStart(event: DragStartEvent) {
    const allTasks = columns.flatMap((col) => col.tasks);
    const dragged = allTasks.find((t) => t.id === event.active.id);
    if (dragged) setActiveDragTask(dragged);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveDragTask(null);

    if (!over) return;

    const allTasks = columns.flatMap((col) => col.tasks);
    const activeTask = allTasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    let newStatus: string | null = null;

    if (over.data?.current?.type !== "column") {
      // Dropped onto another task
      const overTask = allTasks.find((t) => t.id === over.id);
      if (overTask && activeTask.status !== overTask.status) {
        newStatus = overTask.status;
      }
    } else {
      // Dropped onto a column
      const targetStatus = over.data.current.status as string;
      if (activeTask.status !== targetStatus) {
        newStatus = targetStatus;
      }
    }

    if (newStatus) {
      editTaskStatus(activeTask.id, newStatus)
        .then(() => getProjectTasks(Number(projectId)))
        .then((updated) => {
          onTasksUpdate(updated);
          toast.success("Task status updated");
        })
        .catch(() => toast.error("Failed to update task status"));
    }
  }

  function handleDragCancel() {
    setActiveDragTask(null);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="kanban-container">
        <div className="kanban-board">
          {columns.map((column) => (
            <DroppableColumn key={column.id} column={column}>
              <div className="column-header">
                <h2 className="column-title">{column.title}</h2>
                <span className="column-count">{column.count}</span>
              </div>
              <div className="column-content">
                <SortableContext
                  items={column.tasks.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {column.tasks.map((task) => (
                    <SortableTask
                      key={task.id}
                      task={task}
                      borderColor={column.borderColor}
                      onTaskClick={onTaskClick}
                    />
                  ))}
                </SortableContext>
              </div>
            </DroppableColumn>
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeDragTask ? (
          <TaskCard
            task={activeDragTask}
            borderColor={
              columnBorderByStatus[activeDragTask.status] ?? "#CAD5E2"
            }
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
