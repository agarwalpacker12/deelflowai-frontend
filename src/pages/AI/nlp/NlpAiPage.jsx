import React, { useState, useEffect, useRef } from "react";

// Icon components as SVGs
const Brain = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M9.5 2A2.5 2.5 0 0 0 7 4.5v0A2.5 2.5 0 0 0 4.5 7v0A2.5 2.5 0 0 0 2 9.5V16a6 6 0 0 0 6 6 4 4 0 0 0 4-4v0a2 2 0 0 1 2-2 2 2 0 0 1 2 2v0a4 4 0 0 0 4 4 6 6 0 0 0 6-6V9.5A2.5 2.5 0 0 0 23.5 7v0A2.5 2.5 0 0 0 21 4.5v0A2.5 2.5 0 0 0 18.5 2" />
  </svg>
);

const MessageCircle = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

const FileText = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const Send = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22,2 15,22 11,13 2,9 22,2" />
  </svg>
);

const Search = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const Filter = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
  </svg>
);

const Eye = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const BarChart3 = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);

const MessageSquare = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const PenTool = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="M2 2l7.586 7.586" />
    <circle cx="11" cy="11" r="2" />
  </svg>
);

const Mail = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const Smartphone = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const Smile = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

const Frown = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

const Meh = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="8" y1="15" x2="16" y2="15" />
    <line x1="9" y1="9" x2="9.01" y2="9" />
    <line x1="15" y1="9" x2="15.01" y2="9" />
  </svg>
);

const NLPCenterPage = () => {
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      content:
        "Hi! I'm your AI assistant specialized in real estate analysis. I can help you analyze properties, score leads, generate marketing content, and provide market insights. What would you like to work on today?",
      timestamp: new Date(Date.now() - 5000),
      confidence: 96,
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const messagesEndRef = useRef(null);

  // Sample data
  const conversations = [
    {
      id: 1,
      channel: "SMS",
      contact: "Sarah Martinez",
      phone: "(555) 123-4567",
      lastMessage: "I'm interested in selling my property",
      sentiment: "positive",
      leadScore: 94,
      timestamp: "2 minutes ago",
      status: "hot",
      unread: 2,
    },
    {
      id: 2,
      channel: "Email",
      contact: "Michael Chen",
      email: "mchen@email.com",
      lastMessage:
        "Can you provide more details about the investment opportunity?",
      sentiment: "neutral",
      leadScore: 78,
      timestamp: "15 minutes ago",
      status: "warm",
      unread: 0,
    },
    {
      id: 3,
      channel: "WhatsApp",
      contact: "Jennifer Wilson",
      phone: "(555) 987-6543",
      lastMessage: "Not interested at this time",
      sentiment: "negative",
      leadScore: 23,
      timestamp: "1 hour ago",
      status: "cold",
      unread: 0,
    },
  ];

  const documents = [
    {
      id: 1,
      name: "Purchase Agreement - Pine Street",
      type: "Contract",
      pages: 12,
      processed: true,
      insights: [
        "Property value: $180,000",
        "Repair clause present",
        "Standard terms",
      ],
      uploadDate: "2024-01-15",
      confidence: 98,
    },
    {
      id: 2,
      name: "Inspection Report - Oak Avenue",
      type: "Report",
      pages: 8,
      processed: true,
      insights: [
        "Major repairs needed: $23,000",
        "Foundation issues",
        "HVAC replacement required",
      ],
      uploadDate: "2024-01-14",
      confidence: 94,
    },
    {
      id: 3,
      name: "Market Analysis - Houston TX",
      type: "Research",
      pages: 24,
      processed: false,
      insights: [],
      uploadDate: "2024-01-15",
      confidence: 0,
    },
  ];

  const contentTemplates = [
    {
      id: 1,
      name: "Seller Outreach Email",
      category: "Email Marketing",
      description: "Professional email template for motivated seller leads",
      usage: 847,
      conversion: 23.4,
      preview:
        "Hi {name}, I noticed your property at {address} might be perfect for our investment program...",
    },
    {
      id: 2,
      name: "Social Media Property Post",
      category: "Social Media",
      description: "Engaging social media content for property listings",
      usage: 234,
      conversion: 18.7,
      preview:
        "🏠 AMAZING INVESTMENT OPPORTUNITY! This {bedrooms}BR/{bathrooms}BA property in {city} offers...",
    },
    {
      id: 3,
      name: "Follow-up SMS Script",
      category: "SMS Campaign",
      description: "Automated follow-up message for interested leads",
      usage: 1203,
      conversion: 31.2,
      preview:
        "Hi {name}! Thanks for your interest in our real estate services. I have some exciting updates...",
    },
  ];

  const tabs = [
    { id: "chat", label: "AI Chat Assistant", icon: MessageCircle },
    { id: "conversations", label: "Message Center", icon: MessageSquare },
    { id: "documents", label: "Document Analysis", icon: FileText },
    { id: "content", label: "Content Studio", icon: PenTool },
    { id: "analytics", label: "Text Analytics", icon: BarChart3 },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        type: "ai",
        content: generateAIResponse(inputMessage),
        timestamp: new Date(),
        confidence: Math.floor(Math.random() * 10) + 90,
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (message) => {
    const responses = [
      "Based on my analysis, this property shows strong potential with a 94% AI score. The market conditions are favorable, and I recommend moving quickly on this opportunity.",
      "I've identified 3 high-potential leads in your area. The first lead shows urgent motivation indicators and should be contacted within 24 hours for optimal conversion.",
      "Your current portfolio analysis shows a 340% ROI potential. I recommend focusing on properties with AI scores above 85 for maximum profit margins.",
      "Market trends indicate increasing demand in your target area. Properties similar to your search criteria are selling 23% faster than last month.",
      "I've generated a personalized message for your lead based on their psychological profile. This approach has shown 73% higher conversion rates.",
      "The document analysis reveals standard terms with a repair clause. Property value is estimated at $180,000 with potential profit margin of $45,000.",
      "I've created 5 variations of your email campaign. Version 3 shows the highest predicted engagement rate of 31.4% based on similar campaigns.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return <Smile className="w-4 h-4 text-emerald-400" />;
      case "negative":
        return <Frown className="w-4 h-4 text-red-400" />;
      default:
        return <Meh className="w-4 h-4 text-gray-400" />;
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case "SMS":
        return <Smartphone className="w-4 h-4" />;
      case "Email":
        return <Mail className="w-4 h-4" />;
      case "WhatsApp":
        return <MessageCircle className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "hot":
        return "bg-red-900/20 text-red-400";
      case "warm":
        return "bg-amber-900/20 text-amber-400";
      case "cold":
        return "bg-blue-900/20 text-blue-400";
      default:
        return "bg-gray-800/20 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <div className="px-6 py-6 border-b border-purple-800/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">NLP Center</h1>
              <p className="text-purple-200 mt-1">
                Natural language processing hub for text analysis & content
                generation
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">98.2%</div>
              <div className="text-sm text-purple-400">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">24.7K</div>
              <div className="text-sm text-purple-400">Messages Processed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-300">847</div>
              <div className="text-sm text-purple-400">Content Generated</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-2 py-4 border-b-2 font-medium transition-all ${
                    activeTab === tab.id
                      ? "border-purple-400 text-purple-300"
                      : "border-transparent text-purple-500 hover:text-purple-300 hover:border-purple-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "chat" && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-800/30 h-[calc(100vh-200px)] flex flex-col shadow-xl">
              {/* Chat Header */}
              <div className="p-6 border-b border-purple-800/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">
                      Real Estate AI Assistant
                    </h3>
                    <p className="text-sm text-purple-300 flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      Online • Ready to help
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                        message.type === "user"
                          ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white"
                          : "bg-slate-700/50 text-white border border-purple-800/20"
                      }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      <div
                        className={`text-xs mt-1 ${
                          message.type === "user"
                            ? "text-purple-200"
                            : "text-purple-300"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {message.confidence && (
                          <span className="ml-2">
                            • {message.confidence}% confidence
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-purple-800/20">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-6 border-t border-purple-800/30">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      placeholder="Ask about properties, leads, market analysis..."
                      className="w-full px-4 py-3 bg-slate-700/50 border border-purple-700/50 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-purple-400"
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 flex items-center gap-2 shadow-lg transition-all"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "conversations" && (
          <div className="space-y-6">
            {/* Message Center Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Unified Message Center
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-purple-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="bg-slate-700/50 border border-purple-700/50 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 text-white placeholder-purple-400"
                  />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 border border-purple-700/50 rounded-lg text-sm text-purple-300 hover:bg-purple-900/30 transition-all">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>

            {/* Conversations List */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-800/30 shadow-xl">
              <div className="p-6 border-b border-purple-800/30">
                <h3 className="text-lg font-semibold text-white">
                  Recent Conversations
                </h3>
              </div>
              <div className="divide-y divide-purple-800/20">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="p-6 hover:bg-slate-700/30 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center">
                          {getChannelIcon(conversation.channel)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-white">
                              {conversation.contact}
                            </h4>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                                conversation.status
                              )}`}
                            >
                              {conversation.status}
                            </span>
                            {conversation.unread > 0 && (
                              <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                                {conversation.unread}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-purple-300 mb-1">
                            {conversation.lastMessage}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-purple-400">
                            <span className="flex items-center gap-1">
                              {getSentimentIcon(conversation.sentiment)}
                              {conversation.sentiment} sentiment
                            </span>
                            <span>Lead Score: {conversation.leadScore}%</span>
                            <span>{conversation.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-purple-400 hover:text-emerald-400 hover:bg-emerald-900/30 rounded-lg transition-all">
                          <MessageCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-purple-400 hover:text-blue-400 hover:bg-blue-900/30 rounded-lg transition-all">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Other tabs would go here with similar purple theming... */}
        {activeTab !== "chat" && activeTab !== "conversations" && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-purple-800/30 p-8 text-center shadow-xl">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mx-auto mb-4 flex items-center justify-center">
              {activeTab === "documents" && (
                <FileText className="w-8 h-8 text-white" />
              )}
              {activeTab === "content" && (
                <PenTool className="w-8 h-8 text-white" />
              )}
              {activeTab === "analytics" && (
                <BarChart3 className="w-8 h-8 text-white" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {activeTab === "documents" && "Document Analysis"}
              {activeTab === "content" && "AI Content Studio"}
              {activeTab === "analytics" && "Text Analytics"}
            </h3>
            <p className="text-purple-300 mb-6">
              {activeTab === "documents" &&
                "Upload and analyze contracts, reports, and documents with AI"}
              {activeTab === "content" &&
                "Generate compelling marketing content and templates"}
              {activeTab === "analytics" &&
                "Deep text analysis and sentiment tracking"}
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg">
              Coming Soon
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NLPCenterPage;
