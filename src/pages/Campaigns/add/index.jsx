import { useEffect, useState } from "react";
import CreateCampaignForm from "./Form";
import DialogBox from "../../../components/UI/DialogBox";

function AddCampaign() {
  const [open, setOpen] = useState(false);
  const [fillMode, setFillMode] = useState(null); // 'ai' or 'manual'

  useEffect(() => {
    setOpen(true); // Automatically show dialog on render
  }, []);

  const handleModeSelection = (mode) => {
    setFillMode(mode);
    setOpen(false); // Close dialog after selection
    console.log(`Selected mode: ${mode}`);
  };

  // Custom handlers for dialog actions
  const handleDialogSave = () => {
    // Add your save logic here
    console.log("Save button clicked from AddCampaign");

    // For now, we'll just close the dialog
    // You can add validation or other logic before closing
    setOpen(false);
  };

  const handleDialogCancel = () => {
    // Add your cancel logic here
    console.log("Cancel button clicked from AddCampaign");

    // Reset any selections or form data if needed
    setFillMode(null);
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Add New Campaigns
            </h2>
            <p className="text-purple-100">
              Fill out the form below to add a new campaign to your pipeline.
            </p>
            {fillMode && (
              <div className="mt-3 px-3 py-1 bg-white/20 rounded-full inline-block">
                <span className="text-sm text-white">
                  Mode: {fillMode === "ai" ? "🤖 AI Assisted" : "✍️ Manual"}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-6 p-6">
            <CreateCampaignForm fillMode={fillMode} />
          </div>
        </div>
      </div>

      {/* Auto-triggered Dialog Box with custom actions */}
      <DialogBox
        open={open}
        setOpen={setOpen}
        title="Choose Fill Method"
        description="How would you like to fill out the campaign form?"
        onSave={handleDialogSave}
        onCancel={handleDialogCancel}
        saveText="Continue"
        cancelText="Close"
        showActions={false} // Hide default actions since we're using custom buttons in content
      >
        <div className="space-y-4 pt-4">
          {/* AI Option */}
          <button
            onClick={() => handleModeSelection("ai")}
            className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left group"
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-lg">🤖</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-purple-700">
                  Fill with AI Assistant
                </h3>
                <p className="text-sm text-gray-600">
                  Let AI help you generate campaign content and suggestions
                </p>
              </div>
            </div>
          </button>

          {/* Manual Option */}
          <button
            onClick={() => handleModeSelection("manual")}
            className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 text-left group"
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-lg">✍️</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700">
                  Fill Manually
                </h3>
                <p className="text-sm text-gray-600">
                  Fill out the form fields yourself with custom content
                </p>
              </div>
            </div>
          </button>

          <div class="flex justify-end text-gray-600 cursor-pointer">
            <div onClick={() => setOpen(false)}>Skip Selection</div>
          </div>
        </div>
      </DialogBox>
    </div>
  );
}

export default AddCampaign;
