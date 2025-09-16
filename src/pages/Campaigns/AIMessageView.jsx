import React from "react";

const AIMessageView = () => (
  <div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Message Preview */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-2xl">
          <h3 className="text-xl font-semibold text-white mb-1">
            AI-Generated Message
          </h3>
          <p className="text-purple-100">Personalized for John Smith</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <div className="font-semibold mb-2 text-white">Email Subject:</div>
            <div className="text-white/80">
              Quick question about your Miami property
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg">
            <div className="font-semibold mb-2 text-white">Message:</div>
            <div className="text-white/80 leading-relaxed">
              Hi John,
              <br />
              <br />
              I noticed your property at 123 Main St has been listed for a
              while. The Miami market can be challenging right now, and I
              specialize in helping homeowners in similar situations.
              <br />
              <br />
              Would you be open to a brief conversation about your options? I
              have some creative solutions that have helped other Miami
              homeowners move forward quickly.
              <br />
              <br />
              Best regards,
              <br />
              [Your Name]
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-1 rounded text-xs">
              Empathetic Tone
            </span>
            <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-1 rounded text-xs">
              Problem-Solution
            </span>
            <span className="bg-green-500/20 text-green-300 border border-green-500/30 px-2 py-1 rounded text-xs">
              Call-to-Action
            </span>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-2 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all">
              Send Now
            </button>
            <button className="bg-white/10 border border-white/30 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition-all">
              Regenerate
            </button>
          </div>
        </div>
      </div>

      {/* AI Settings */}
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-t-2xl">
          <h3 className="text-xl font-semibold text-white mb-1">
            AI Configuration
          </h3>
          <p className="text-purple-100">Fine-tune message generation</p>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <label className="block font-semibold mb-3 text-white">
              Creativity Level
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="10"
                defaultValue="7"
                className="flex-1 accent-purple-500"
              />
              <span className="font-semibold w-8 text-center text-white">
                7
              </span>
            </div>
            <p className="text-xs text-white/60 mt-1">
              Higher values create more varied messages
            </p>
          </div>

          <div>
            <label className="block font-semibold mb-3 text-white">
              Message Tone
            </label>
            <select className="w-full p-3 bg-white/10 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-purple-500">
              <option className="bg-purple-800">Professional</option>
              <option className="bg-purple-800">Friendly</option>
              <option className="bg-purple-800">Urgent</option>
              <option className="bg-purple-800">Empathetic</option>
              <option className="bg-purple-800">Direct</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-3 text-white">
              Personalization Factors
            </label>
            <div className="space-y-2">
              {[
                "Property details",
                "Market conditions",
                "Time on market",
                "Previous interactions",
              ].map((factor, index) => (
                <label
                  key={index}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    defaultChecked={index < 3}
                    className="rounded text-purple-500 bg-white/10 border-white/30 focus:ring-purple-500"
                  />
                  <span className="text-sm text-white">{factor}</span>
                </label>
              ))}
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-lg hover:from-purple-600 hover:to-indigo-600 font-semibold transition-all">
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default AIMessageView;
