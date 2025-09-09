import React from "react";
import { Link } from "react-router-dom";
import { Brain, Zap, TrendingUp, Users, Shield, Rocket } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI-Enhanced Real Estate Wholesaling
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Connect motivated sellers with qualified investors using intelligent
            lead qualification, automated conversations, and predictive
            analytics powered by advanced AI.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              // className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 border border-white/20 hover:border-white/30"
            >
              Get Started Free
            </Link>
            {/* {!isAuthenticated && ( */}
            <Link
              to="/login"
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 border border-white/20 hover:border-white/30"
            >
              Sign In
            </Link>
            {/* )} */}
            {/* <Link
              to="/pay"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Pay Now
            </Link> */}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
          <FeatureCard
            icon={<Brain className="w-8 h-8" />}
            title="AI Lead Qualification"
            description="Automatically score and qualify leads using advanced machine learning algorithms"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Automated Conversations"
            description="AI-powered chatbots handle initial conversations and schedule appointments"
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Predictive Analytics"
            description="Forecast deal success probability and optimize your investment strategy"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title="Real-time Marketplace"
            description="Connect with investors and buyers in a live trading environment"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Blockchain Security"
            description="Secure transactions with smart contracts and digital escrow"
          />
          <FeatureCard
            icon={<Rocket className="w-8 h-8" />}
            title="White Label Ready"
            description="Launch your own branded platform with our white label solution"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
      <div className="text-blue-400 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

export default LandingPage;
