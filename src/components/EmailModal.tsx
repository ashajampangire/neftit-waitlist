
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useWaitlist } from "@/hooks/useWaitlist";

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string, entry: any) => void;
  referralCode?: string;
}

const EmailModal = ({ isOpen, onClose, onSuccess, referralCode }: EmailModalProps) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const { joinWaitlist, loading } = useWaitlist();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const entry = await joinWaitlist(email.trim(), name.trim() || undefined, referralCode);
    if (entry) {
      onSuccess(email.trim(), entry);
      onClose();
      setEmail("");
      setName("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-purple-900 border-purple-500/20">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold text-center">
            Join the NEFTIT Waitlist
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black/20 border-purple-500/20 text-white placeholder-purple-300"
              required
            />
          </div>
          <div>
            <Input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-black/20 border-purple-500/20 text-white placeholder-purple-300"
            />
          </div>
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-800/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !email.trim()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              {loading ? "Joining..." : "Join Waitlist"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmailModal;
