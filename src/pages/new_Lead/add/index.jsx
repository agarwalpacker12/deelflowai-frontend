import { useEffect, useState } from "react";
import CreateCampaignForm from "./Form";
import DialogBox from "../../../components/UI/DialogBox";

function AddNewLead({ open, setOpen }) {
  const [fillMode, setFillMode] = useState(null); // 'ai' or 'manual'

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
          </div>

          <div className="space-y-6 p-6">
            <CreateCampaignForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddNewLead;
