import React, { useState, useEffect } from "react";

const ComingSoonPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Launch date - set to 30 days from now for demo
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 30);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleEmailSubmit = () => {
    if (email) {
      setIsSubmitted(true);
      setEmail("");
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Logo/Brand */}
        <div className="mb-8 mt-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tight">
            Next
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Gen
            </span>
          </h1>
          <p className="text-xl text-purple-200 font-light">
            The Future is Loading...
          </p>
        </div>

        {/* Main heading */}
        <div className="mb-12 max-w-4xl">
          <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Something
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">
              Amazing
            </span>
            is Coming
          </h2>
          <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
            We're crafting an extraordinary experience that will revolutionize
            the way you interact with technology. Get ready for something
            incredible.
          </p>
        </div>

        {/* Countdown Timer */}
        {/* <div className="mb-12">
          <h3 className="text-2xl font-semibold text-white mb-6">
            Launch Countdown
          </h3>
          <div className="flex justify-center space-x-4 md:space-x-8">
            {[
              { label: "Days", value: timeLeft.days },
              { label: "Hours", value: timeLeft.hours },
              { label: "Minutes", value: timeLeft.minutes },
              { label: "Seconds", value: timeLeft.seconds },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/20 shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {String(value).padStart(2, "0")}
                </div>
                <div className="text-sm text-purple-200 uppercase tracking-wider">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Email Signup */}
        {/* <div className="mb-12 w-full max-w-md">
          <h3 className="text-xl font-semibold text-white mb-6">
            Be the First to Know
          </h3>
          <div className="space-y-4">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
              />
            </div>
            <button
              onClick={handleEmailSubmit}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-8 rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-purple-500/25"
            >
              {isSubmitted ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Thank You!
                </span>
              ) : (
                "Notify Me When It's Ready"
              )}
            </button>
          </div>
          {isSubmitted && (
            <p className="text-green-300 text-sm mt-4 animate-fadeIn">
              🎉 You're on the list! We'll notify you when we launch.
            </p>
          )}
        </div> */}

        {/* Social Links */}
        {/* <div className="flex space-x-6">
          {[
            { icon: "twitter", href: "#" },
            { icon: "facebook", href: "#" },
            { icon: "instagram", href: "#" },
            { icon: "linkedin", href: "#" },
          ].map(({ icon, href }) => (
            <a
              key={icon}
              href={href}
              className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 hover:scale-110 border border-white/20"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                {icon === "twitter" && (
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                )}
                {icon === "facebook" && (
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                )}
                {icon === "instagram" && (
                  <path d="M16 8a6 6 0 11-12 0 6 6 0 0112 0zM2 8a6 6 0 1012 0A6 6 0 002 8zm6-3a3 3 0 100 6 3 3 0 000-6z" />
                )}
                {icon === "linkedin" && (
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                )}
              </svg>
            </a>
          ))}
        </div> */}

        {/* Footer */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <p className="text-purple-300 text-sm">
            © 2025 NextGen. All rights reserved.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.5;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float linear infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ComingSoonPage;
