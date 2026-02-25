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
