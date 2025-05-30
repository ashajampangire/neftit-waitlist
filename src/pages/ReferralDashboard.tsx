
import { useState, useEffect } from "react";
import { X, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useWaitlist } from "@/hooks/useWaitlist";
import LeaderboardItem from "@/components/LeaderboardItem";

const ReferralDashboard = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [userReferralCount, setUserReferralCount] = useState(0);
  const [userRank, setUserRank] = useState("#001");
  const { toast } = useToast();
  const { getLeaderboard } = useWaitlist();

  const referralLink = userInfo?.referral_code 
    ? `${window.location.origin}/waitlist?ref=${userInfo.referral_code}`
    : "https://neftit.com/waitlist";

  useEffect(() => {
    // Load user info from localStorage (set during waitlist signup)
    const storedUser = localStorage.getItem('waitlist_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserInfo(userData);
    }

    // Load leaderboard data
    const loadLeaderboard = async () => {
      const data = await getLeaderboard();
      setLeaderboardData(data.slice(0, 4));
      
      // Find user's position and referral count
      if (userInfo?.email) {
        const userEntry = data.find((entry: any) => entry.email === userInfo.email);
        if (userEntry) {
          setUserReferralCount(userEntry.referral_count);
          const rank = data.findIndex((entry: any) => entry.email === userInfo.email) + 1;
          setUserRank(`#${rank.toString().padStart(3, '0')}`);
        }
      }
    };

    if (userInfo?.email) {
      loadLeaderboard();
    }
  }, [getLeaderboard, userInfo?.email]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link copied!",
      description: "Referral link has been copied to clipboard.",
    });
  };

  const shareOnTwitter = () => {
    const tweetText = encodeURIComponent("Join me on the NEFTIT waitlist for the future of Web3! 🚀");
    const url = encodeURIComponent(referralLink);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${url}`, "_blank");
  };

  // Redirect to waitlist if no user info
  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Access Denied</h1>
          <p className="text-purple-300">Please join the waitlist first to access your dashboard.</p>
          <Button
            onClick={() => window.location.href = "/waitlist"}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            Join Waitlist
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        {/* User Profile Card */}
        <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-purple-400"></div>
                </div>
              </div>
              <div>
                <h2 className="text-purple-300 text-2xl font-bold">
                  {userInfo?.name || "NEFTIT BELIEVER"}
                </h2>
                <p className="text-purple-400">{userInfo?.email}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-3">
                <div className="text-purple-300">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white text-2xl font-bold">YOUR RANK</h3>
                  <p className="text-purple-300 text-3xl font-bold">{userRank}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Referrals and Invite Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Your Referrals */}
          <div className="space-y-4">
            <div>
              <h3 className="text-white text-xl font-bold mb-2">YOUR REFERRALS</h3>
              <div className="text-purple-300 text-6xl font-bold">
                {userReferralCount} <span className="text-2xl">JOINED!</span>
              </div>
              <p className="text-purple-400 text-sm mt-2">INVITE MORE FRIENDS TO CLIMB ON TOP</p>
            </div>
          </div>

          {/* Invite Friends */}
          <div className="space-y-4">
            <h3 className="text-white text-xl font-bold">INVITE YOUR FRIENDS</h3>
            <div className="space-y-3">
              <Input
                value={referralLink}
                readOnly
                className="bg-black/20 border-purple-500/20 text-white rounded-xl"
              />
              <div className="flex space-x-3">
                <Button
                  onClick={shareOnTwitter}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-2 font-semibold"
                >
                  <X className="w-4 h-4 mr-2" />
                  SHARE ON X
                </Button>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-800/20 rounded-xl py-2 font-semibold"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  COPY LINK
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
          <h3 className="text-white text-3xl font-bold mb-2">LEADERBOARD</h3>
          <p className="text-purple-400 mb-6">NEFTIT TOP REFERRERS</p>
          
          <div className="space-y-3">
            {leaderboardData.map((item, index) => (
              <LeaderboardItem
                key={item.email}
                rank={index + 1}
                name={item.name}
                referrals={parseInt(item.referral_count)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralDashboard;
