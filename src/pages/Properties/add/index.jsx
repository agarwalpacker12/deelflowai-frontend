import AddPropertyForm from "./Form";

function AddProperty() {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Add Property
            </h2>
            <p className="text-purple-100">
              Fill out the form below to add a new property to your pipeline.
            </p>
          </div>

          <div className="space-y-6">
            <AddPropertyForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProperty;
