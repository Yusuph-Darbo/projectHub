import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card.jsx";
import { FaPlus } from "react-icons/fa";
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

export async function TaskModal({
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

  return <></>;
}
