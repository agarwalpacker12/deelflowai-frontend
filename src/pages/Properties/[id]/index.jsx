import { useParams } from "react-router-dom";
import EditPropertyForm from "./Form";
import { propertiesAPI } from "../../../services/api";
import { useEffect, useState } from "react";

 
function EditProperty() {
  const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 



   useEffect(() => {
      const fetchProperty = async () => {
        setLoading(true);
        try {
          const response = await propertiesAPI.getProperty(id);
          setProperty(response.data.data); // Adjust if your API response is nested differently
        } catch (err) {
          setError("Failed to fetch lead details");
        } finally {
          setLoading(false);
        }
      };
      fetchProperty();
    }, [id]);

    
  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Edit Property
            </h2>
            <p className="text-purple-100">
              Fill out the form below to update a property to your pipeline.
            </p>
          </div>

          {/* Success Message */}

          <div className="space-y-6">
            <EditPropertyForm propertyRes={property}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProperty;
