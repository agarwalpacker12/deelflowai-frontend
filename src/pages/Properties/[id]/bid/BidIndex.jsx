import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import AddDealsForm from "../../../Deals/add/Form";
import { useParams } from "react-router-dom";
import { propertiesAPI } from "../../../../services/api";

function BidIndex() {
  const { propertyId } = useParams();
  const [submitStatus, setSubmitStatus] = useState(null);
  const [propertyDetails, setPropertyDetails] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        const response = await propertiesAPI.getProperty(propertyId);
        console.log("response12", response.data.data);

        setPropertyDetails(response.data.data); // Adjust if your API response is nested differently
      } catch (err) {
        setError("Failed to fetch lead details");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8">
            <h2 className="text-3xl font-bold text-white mb-2">Add New Deal</h2>
            <p className="text-purple-100">
              Fill out the form below to add a new deal to your pipeline.
            </p>
          </div>

          <div className="p-6 md:p-8">
            {/* Success Message */}
            {submitStatus && submitStatus.type === "success" && (
              <div className="mb-6 p-4 rounded-lg bg-green-50 border-l-4 border-green-400 text-green-800">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {submitStatus.message}
                </div>
              </div>
            )}

            {/* Error Message */}
            {submitStatus && submitStatus.type === "error" && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 border-l-4 border-red-400 text-red-800">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {submitStatus.message}
                </div>
              </div>
            )}

            <div className="space-y-6">
              <AddDealsForm
                propertyId={propertyId}
                propertyDetails={propertyDetails}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BidIndex;
