import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "../../components/ui/card.jsx";

interface MemberModalProps {
  memberEmail: string;
  setMemberEmail: (v: string) => void;
  onSave: () => void;
  onClose: () => void;
  isLoading: boolean;
}

export default function memberModal({
  memberEmail,
  setMemberEmail,
  onSave,
  onClose,
  isLoading,
}: MemberModalProps) {
  const isFormValid = memberEmail.trim().length > 0;

  return (
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <Card className="create-task-card">
        <CardHeader>
          <CardTitle>Add new member</CardTitle>
          <CardDescription>
            Add a new member to your project. Enter their email and they will be
            apart of this project
          </CardDescription>

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
            <label htmlFor="task-name">Member email</label>
            <input
              type="text"
              id="member-email"
              placeholder="Enter member email"
              className="form-input"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
            />
          </div>
        </CardContent>

        <CardFooter>
          <div>
            <button className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn-create"
              disabled={!isFormValid}
              onClick={onSave}
            >
              {isLoading ? "Saving..." : "Add member"}
            </button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
