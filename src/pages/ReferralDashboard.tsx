
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import LeaderboardItem from "@/components/LeaderboardItem";

const ReferralDashboard = () => {
  const [referralLink] = useState("https://neftit.com/waitlist?ref=ggpiglh3t");
  const { toast } = useToast();

  const leaderboardData = [
    { rank: 1, name: "LOREM IPSUM", referrals: 12 },
    { rank: 2, name: "LOREM IPSUM", referrals: 11 },
    { rank: 3, name: "LOREM IPSUM", referrals: 10 },
    { rank: 4, name: "LOREM IPSUM", referrals: 9 },
  ];

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
                <h2 className="text-purple-300 text-2xl font-bold">YOUR NAME HERE</h2>
                <p className="text-purple-400">@USERNAME</p>
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
                  <p className="text-purple-300 text-3xl font-bold">#001</p>
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
              <div className="text-purple-300 text-6xl font-bold">12 <span className="text-2xl">JOINED!</span></div>
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
                  SHARE ON TWITTER
                </Button>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-800/20 rounded-xl py-2 font-semibold"
                >
                  📋 COPY LINK
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
            {leaderboardData.map((item) => (
              <LeaderboardItem
                key={item.rank}
                rank={item.rank}
                name={item.name}
                referrals={item.referrals}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralDashboard;
