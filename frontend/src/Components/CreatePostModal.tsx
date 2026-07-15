import { useCreatePostForm } from "../hooks/useCreatePostForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePostModal({ open, onOpenChange }: CreatePostModalProps) {
  const form = useCreatePostForm();

  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Criar publicação</DialogTitle>
        <DialogDescription>
          Preencha os dados abaixo. Sua publicação será enviada para aprovação.
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>;
}
