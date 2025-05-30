
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-white mb-4">NEFTIT</h1>
          <p className="text-purple-200 text-lg">The Future of Web3 Experience</p>
        </div>
        
        <div className="space-y-4">
          <Link to="/waitlist">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105">
              Join Waitlist
            </Button>
          </Link>
          
          <Link to="/dashboard">
            <Button variant="outline" className="w-full border-purple-400 text-purple-200 hover:bg-purple-800/20 font-semibold py-3 px-8 rounded-xl transition-all duration-300">
              View Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
