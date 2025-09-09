import React, { useState, useEffect } from "react";
import {
  Brain,
  Target,
  Zap,
  TrendingUp,
  Users,
  Award,
  Clock,
  Eye,
  Heart,
  Star,
  Trophy,
  Flame,
  Crown,
  Diamond,
  Rocket,
  Sparkles,
  Layers,
  Activity,
  Radar,
  Wand2,
  CircuitBoard,
  Atom,
  Fingerprint,
} from "lucide-react";

// ==================== MAIN PSYCHOLOGICAL DASHBOARD ====================

const CompletePsychologicalDashboard = () => {
  const [psychProfile] = useState({
    personalityType: "ENTJ",
    decisionStyle: "analytical",
    riskTolerance: "moderate",
    maslowLevel: "esteem_needs",
    cognitiveBiases: [
      "anchoring",
      "social_proof",
      "loss_aversion",
      "halo_effect",
      "confirmation_bias",
    ],
    motivationDrivers: [
      "financial_gain",
      "achievement",
      "recognition",
      "security",
      "status",
    ],
    trustFactors: ["expertise", "guarantees", "social_proof", "transparency"],
  });

  const [metrics] = useState({
    neural_activation: 85,
    subconscious_influence: 78,
    behavioral_prediction: 91,
    psychologicalReactance: 23,
    persuasionScore: 87,
    emotionalEngagement: 92,
    trustLevel: 78,
  });

  const [features] = useState({
    unity_triggers: 89,
    reason_why_patterns: 76,
    contrast_principle: 82,
    availability_heuristic: 84,
    framing_effects: 78,
    halo_effect: 85,
    mental_accounting: 73,
    endowment_effect: 88,
    milton_model: 83,
    embedded_commands: 77,
    presuppositions: 88,
    fear_appeals: 86,
    pride_triggers: 74,
    tribal_identification: 94,
    status_signaling: 87,
    achievement_systems: 89,
    visual_triggers: 86,
    urgency_creation: 93,
    existential_fears: 82,
    social_fears: 88,
    financial_fears: 91,
    priming_effects: 76,
    implicit_associations: 83,
    pattern_interrupts: 88,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                  <CircuitBoard className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold">
                  Neural Influence Control Center
                </h1>
                <div className="flex items-center space-x-6 text-sm text-gray-300">
                  <span className="flex items-center space-x-1">
                    <Brain className="w-4 h-4 text-cyan-400" />
                    <span>Neural: {metrics.neural_activation}%</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Atom className="w-4 h-4 text-purple-400" />
                    <span>Subconscious: {metrics.subconscious_influence}%</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Radar className="w-4 h-4 text-pink-400" />
                    <span>Prediction: {metrics.behavioral_prediction}%</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-3 py-2 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
                <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-sm font-semibold text-cyan-300">
                  Active
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative w-8 h-8">
                  <svg
                    className="w-8 h-8 transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="10"
                      fill="none"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="35"
                      stroke="#ef4444"
                      strokeWidth="10"
                      fill="none"
                      strokeDasharray={`${
                        metrics.psychologicalReactance * 2.2
                      } 220`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-red-400">
                      {metrics.psychologicalReactance}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-400">Reactance</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top Level Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <PsychologyControlPanel features={features} />
          </div>
          <div>
            <SubconsciousMonitor metrics={metrics} />
          </div>
        </div>

        {/* Psychology Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <PsychologyCard
            title="Cialdini Extended"
            category="Influence Principles"
            icon={<Crown className="w-6 h-6" />}
            gradient="from-yellow-500 to-orange-500"
            metrics={[
              { name: "Unity", value: features.unity_triggers },
              { name: "Reason Why", value: features.reason_why_patterns },
              { name: "Contrast", value: features.contrast_principle },
            ]}
          />

          <PsychologyCard
            title="Cognitive Biases"
            category="50+ Bias Types"
            icon={<Brain className="w-6 h-6" />}
            gradient="from-purple-500 to-indigo-500"
            metrics={[
              { name: "Availability", value: features.availability_heuristic },
              { name: "Framing", value: features.framing_effects },
              { name: "Halo Effect", value: features.halo_effect },
            ]}
          />

          <PsychologyCard
            title="NLP Patterns"
            category="Language Programming"
            icon={<Wand2 className="w-6 h-6" />}
            gradient="from-pink-500 to-rose-500"
            metrics={[
              { name: "Milton Model", value: features.milton_model },
              { name: "Embedded Commands", value: features.embedded_commands },
              { name: "Presuppositions", value: features.presuppositions },
            ]}
          />

          <PsychologyCard
            title="Fear Psychology"
            category="Advanced Fear Appeals"
            icon={<Zap className="w-6 h-6" />}
            gradient="from-red-500 to-pink-500"
            metrics={[
              { name: "Existential", value: features.existential_fears },
              { name: "Social", value: features.social_fears },
              { name: "Financial", value: features.financial_fears },
            ]}
          />

          <PsychologyCard
            title="Subliminal Influence"
            category="Subconscious Control"
            icon={<Atom className="w-6 h-6" />}
            gradient="from-cyan-500 to-blue-500"
            metrics={[
              { name: "Priming", value: features.priming_effects },
              {
                name: "Implicit Assoc.",
                value: features.implicit_associations,
              },
              {
                name: "Pattern Interrupts",
                value: features.pattern_interrupts,
              },
            ]}
          />
        </div>

        {/* Advanced Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <EmotionalManipulationLab />
          <NeuralPersuasionEngine />
        </div>

        {/* Specialized Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <FearPsychologyModule />
          <TribalPsychologyModule />
          <SensoryMarketingModule />
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PersonalityMapper profile={psychProfile} />
          <PersuasionArchitecture />
        </div>
      </div>
    </div>
  );
};

// ==================== PSYCHOLOGY CONTROL PANEL ====================

const PsychologyControlPanel = ({ features }) => {
  const [activeTab, setActiveTab] = useState("cialdini");

  const tabs = {
    cialdini: {
      name: "Cialdini Extended",
      icon: Crown,
      features: ["unity_triggers", "reason_why_patterns", "contrast_principle"],
    },
    biases: {
      name: "Cognitive Biases",
      icon: Brain,
      features: ["availability_heuristic", "framing_effects", "halo_effect"],
    },
    nlp: {
      name: "NLP Patterns",
      icon: Wand2,
      features: ["milton_model", "embedded_commands", "presuppositions"],
    },
    subliminal: {
      name: "Subliminal",
      icon: Atom,
      features: [
        "priming_effects",
        "implicit_associations",
        "pattern_interrupts",
      ],
    },
  };

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center space-x-2">
          <Layers className="w-6 h-6 text-cyan-400" />
          <span>Psychology Control Panel</span>
        </h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">All Systems Active</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(tabs).map(([key, tab]) => {
          const Icon = tab.icon;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                activeTab === key
                  ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/50"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tabs[activeTab].features.map((feature) => (
          <FeatureCard key={feature} name={feature} value={features[feature]} />
        ))}
      </div>
    </div>
  );
};

// ==================== FEATURE CARD ====================

const FeatureCard = ({ name, value }) => {
  const displayName = name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="p-4 bg-white/5 rounded-lg border border-white/10 hover:border-white/20 transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="font-medium text-white text-sm">{displayName}</span>
        <span className="text-cyan-400 font-bold text-lg">{value}%</span>
      </div>
      <div className="w-full bg-gray-600 rounded-full h-2">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000"
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};

// ==================== PSYCHOLOGY CARD ====================

const PsychologyCard = ({ title, category, icon, gradient, metrics }) => {
  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300">
      <div
        className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center mb-4`}
      >
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-sm text-gray-400 mb-4">{category}</p>

      <div className="space-y-2">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-300">{metric.name}</span>
            <span className="text-sm font-bold text-white">
              {metric.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== SUBCONSCIOUS MONITOR ====================

const SubconsciousMonitor = ({ metrics }) => {
  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
        <Atom className="w-5 h-5 text-purple-400" />
        <span>Subconscious Monitor</span>
      </h3>

      <div className="space-y-4">
        <MetricBar
          label="Neural Activation"
          value={metrics.neural_activation}
          color="from-purple-500 to-pink-500"
        />
        <MetricBar
          label="Subconscious Influence"
          value={metrics.subconscious_influence}
          color="from-pink-500 to-purple-500"
        />
        <MetricBar
          label="Behavioral Prediction"
          value={metrics.behavioral_prediction}
          color="from-cyan-500 to-blue-500"
        />
      </div>
    </div>
  );
};

// ==================== METRIC BAR ====================

const MetricBar = ({ label, value, color }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-300">{label}</span>
        <span className="text-purple-400 font-bold">{value}%</span>
      </div>
      <div className="w-full bg-gray-600 rounded-full h-2">
        <div
          className={`h-2 rounded-full bg-gradient-to-r ${color} transition-all duration-1000`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};

// ==================== EMOTIONAL MANIPULATION LAB ====================

const EmotionalManipulationLab = () => {
  const [emotionalArc] = useState([
    { phase: "Attention", emotion: "curiosity", intensity: 78 },
    { phase: "Interest", emotion: "hope", intensity: 85 },
    { phase: "Desire", emotion: "urgency", intensity: 92 },
    { phase: "Action", emotion: "confidence", intensity: 88 },
    { phase: "Satisfaction", emotion: "accomplishment", intensity: 95 },
  ]);

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
        <Heart className="w-5 h-5 text-pink-400" />
        <span>Emotional Manipulation Lab</span>
      </h3>

      <div className="space-y-4">
        {emotionalArc.map((phase, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg"
          >
            <div className="w-20 text-sm font-semibold text-gray-300">
              {phase.phase}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium capitalize">
                  {phase.emotion}
                </span>
                <span className="text-sm text-pink-400">
                  {phase.intensity}%
                </span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-1000"
                  style={{ width: `${phase.intensity}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg border border-pink-500/30">
        <div className="text-sm font-semibold text-pink-300 mb-2">
          AI Optimization
        </div>
        <p className="text-xs text-gray-300">
          Emotional arc optimized for 92% effectiveness. Peak vulnerability at
          Desire phase.
        </p>
      </div>
    </div>
  );
};

// ==================== NEURAL PERSUASION ENGINE ====================

const NeuralPersuasionEngine = () => {
  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold flex items-center space-x-2">
          <Brain className="w-5 h-5 text-blue-400" />
          <span>Neural Persuasion Engine</span>
        </h3>
        <div className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">
          ACTIVE
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-500/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-400">47</div>
          <div className="text-sm text-gray-300">Active Triggers</div>
        </div>
        <div className="text-center p-3 bg-purple-500/20 rounded-lg">
          <div className="text-2xl font-bold text-purple-400">91%</div>
          <div className="text-sm text-gray-300">Success Rate</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="p-3 bg-white/5 rounded-lg">
          <div className="text-sm font-semibold mb-1">Pattern Recognition</div>
          <div className="text-xs text-gray-400">
            Analyzing behavioral patterns in real-time
          </div>
        </div>
        <div className="p-3 bg-white/5 rounded-lg">
          <div className="text-sm font-semibold mb-1">
            Influence Optimization
          </div>
          <div className="text-xs text-gray-400">
            Adjusting psychological triggers for maximum impact
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== FEAR PSYCHOLOGY MODULE ====================

const FearPsychologyModule = () => {
  const fearTypes = [
    { name: "Existential", intensity: 82, color: "text-red-400" },
    { name: "Social", intensity: 88, color: "text-orange-400" },
    { name: "Financial", intensity: 91, color: "text-yellow-400" },
  ];

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
        <Zap className="w-5 h-5 text-red-400" />
        <span>Fear Psychology</span>
      </h3>

      <div className="space-y-4">
        {fearTypes.map((fear, index) => (
          <div
            key={index}
            className="p-3 bg-red-500/10 rounded-lg border border-red-500/20"
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`font-semibold ${fear.color}`}>
                {fear.name} Fears
              </span>
              <span className="text-red-400 font-bold">{fear.intensity}%</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-1000"
                style={{ width: `${fear.intensity}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== TRIBAL PSYCHOLOGY MODULE ====================

const TribalPsychologyModule = () => {
  const tribalElements = [
    { name: "In-Group ID", strength: 94, active: true },
    { name: "Out-Group Rejection", strength: 87, active: true },
    { name: "Tribal Loyalty", strength: 91, active: false },
    { name: "Shared Enemy", strength: 83, active: true },
  ];

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
        <Users className="w-5 h-5 text-orange-400" />
        <span>Tribal Psychology</span>
      </h3>

      <div className="space-y-3">
        {tribalElements.map((element, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border transition-all ${
              element.active
                ? "bg-orange-500/20 border-orange-500/50"
                : "bg-gray-500/10 border-gray-500/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{element.name}</span>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    element.active
                      ? "bg-orange-400 animate-pulse"
                      : "bg-gray-400"
                  }`}
                ></div>
                <span className="text-sm font-bold">{element.strength}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== SENSORY MARKETING MODULE ====================

const SensoryMarketingModule = () => {
  const sensoryChannels = [
    { name: "Visual", activation: 86, color: "text-blue-400" },
    { name: "Auditory", activation: 73, color: "text-green-400" },
    { name: "Kinesthetic", activation: 68, color: "text-purple-400" },
  ];

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
        <Eye className="w-5 h-5 text-cyan-400" />
        <span>Sensory Marketing</span>
      </h3>

      <div className="space-y-4">
        {sensoryChannels.map((channel, index) => (
          <div key={index} className="p-3 bg-white/5 rounded-lg">
            <div className={`text-sm font-semibold ${channel.color} mb-2`}>
              {channel.name} Triggers
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-400">Activation Level</span>
              <span className="text-sm font-bold">{channel.activation}%</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-1">
              <div
                className={`h-1 rounded-full transition-all duration-1000 ${
                  channel.color.includes("blue")
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                    : channel.color.includes("green")
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : "bg-gradient-to-r from-purple-500 to-violet-500"
                }`}
                style={{ width: `${channel.activation}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==================== PERSONALITY MAPPER ====================

const PersonalityMapper = ({ profile }) => {
  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
        <Fingerprint className="w-5 h-5 text-green-400" />
        <span>Personality Mapper</span>
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="text-sm text-gray-400 mb-1">Type</div>
          <div className="text-lg font-bold text-green-400">
            {profile.personalityType}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400 mb-1">Decision Style</div>
          <div className="text-lg font-bold text-blue-400 capitalize">
            {profile.decisionStyle}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400 mb-1">Risk Level</div>
          <div className="text-lg font-bold text-yellow-400 capitalize">
            {profile.riskTolerance}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-400 mb-1">Maslow Stage</div>
          <div className="text-lg font-bold text-purple-400 capitalize">
            {profile.maslowLevel?.replace("_", " ")}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="text-sm font-semibold mb-2">Cognitive Biases</div>
          <div className="flex flex-wrap gap-1">
            {profile.cognitiveBiases.slice(0, 3).map((bias, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded"
              >
                {bias.replace("_", " ")}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== PERSUASION ARCHITECTURE ====================

const PersuasionArchitecture = () => {
  const levels = [
    { name: "Attention", progress: 95, color: "from-blue-500 to-cyan-500" },
    { name: "Interest", progress: 88, color: "from-green-500 to-emerald-500" },
    { name: "Desire", progress: 92, color: "from-yellow-500 to-orange-500" },
    { name: "Action", progress: 87, color: "from-red-500 to-pink-500" },
    { name: "Retention", progress: 91, color: "from-purple-500 to-indigo-500" },
  ];

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-bold mb-6 flex items-center space-x-2">
        <Layers className="w-5 h-5 text-indigo-400" />
        <span>Persuasion Architecture</span>
      </h3>

      <div className="space-y-4">
        {levels.map((level, index) => (
          <div
            key={index}
            className="p-3 rounded-lg bg-white/5 border border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white">{level.name}</span>
              <span className="text-sm font-bold">{level.progress}%</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${level.color} transition-all duration-1000`}
                style={{ width: `${level.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletePsychologicalDashboard;
