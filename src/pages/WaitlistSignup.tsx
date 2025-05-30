
import { useState, useEffect } from "react";
import { Mail, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import WaitlistCard from "@/components/WaitlistCard";
import EmailModal from "@/components/EmailModal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useWaitlist } from "@/hooks/useWaitlist";

const WaitlistSignup = () => {
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref');
  
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [waitlistCount, setWaitlistCount] = useState(1247);
  
  const { toast } = useToast();
  const { getTotalWaitlistCount } = useWaitlist();

  useEffect(() => {
    // Load waitlist count
    const loadWaitlistCount = async () => {
      const count = await getTotalWaitlistCount();
      setWaitlistCount(count);
    };
    loadWaitlistCount();
  }, [getTotalWaitlistCount]);
  
  const handleActionComplete = (actionId: string) => {
    if (actionId === 'email') {
      setShowEmailModal(true);
      return;
    }

    if (actionId === 'twitter') {
      window.open('https://twitter.com/neftit', '_blank');
    }

    if (actionId === 'discord') {
      window.open('https://discord.gg/neftit', '_blank');
    }

    if (!completedActions.includes(actionId)) {
      setCompletedActions([...completedActions, actionId]);
      toast({
        title: "Action completed!",
        description: "You're one step closer to early access.",
      });
    }
  };

  const handleEmailSuccess = (email: string, entry: any) => {
    setUserEmail(email);
    setCompletedActions([...completedActions, 'email']);
    // Store user data in localStorage for dashboard
    localStorage.setItem('waitlist_user', JSON.stringify({
      email,
      referral_code: entry.referral_code,
      name: entry.name
    }));
  };

  const allActionsCompleted = completedActions.length === 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white tracking-wider">
            JOIN THE WAITLIST
          </h1>
          <p className="text-purple-200 text-lg">
            FOR THE NEFTIT WEB3 EXPERIENCE
          </p>
          {referralCode && (
            <p className="text-purple-300 text-sm">
              You were invited by a friend! 🎉
            </p>
          )}
        </div>

        {/* Action Cards */}
        <div className="space-y-4">
          <WaitlistCard
            icon={<Mail className="w-6 h-6" />}
            title="Connect Email"
            subtitle="To Receive Latest Updates First"
            completed={completedActions.includes("email")}
            onClick={() => handleActionComplete("email")}
          />
          
          <WaitlistCard
            icon={<X className="w-6 h-6" />}
            title="Follow Us On X"
            subtitle="To Stay Updated On Latest News"
            completed={completedActions.includes("twitter")}
            onClick={() => handleActionComplete("twitter")}
          />
          
          <WaitlistCard
            icon={
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
              </svg>
            }
            title="Join Our Discord"
            subtitle="Join & Become A Part Of our community"
            completed={completedActions.includes("discord")}
            onClick={() => handleActionComplete("discord")}
          />
        </div>

        {/* Enter Button */}
        <Button
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
            allActionsCompleted
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white transform hover:scale-105"
              : "bg-gray-600 text-gray-300 cursor-not-allowed"
          }`}
          disabled={!allActionsCompleted}
          onClick={() => {
            if (allActionsCompleted) {
              window.location.href = "/dashboard";
            }
          }}
        >
          ENTER NEFTIT →
        </Button>

        {/* Stats */}
        <div className="text-center">
          <p className="text-purple-300">
            <span className="text-white font-bold">{waitlistCount.toLocaleString()}</span> Believers Joined Already!
          </p>
        </div>

        {/* Email Modal */}
        <EmailModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          onSuccess={handleEmailSuccess}
          referralCode={referralCode || undefined}
        />
      </div>
    </div>
  );
};

export default WaitlistSignup;
