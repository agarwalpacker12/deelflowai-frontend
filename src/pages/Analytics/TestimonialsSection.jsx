import { Star } from "lucide-react";
import React from "react";

function TestimonialsSection({ testimonials }) {
  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-6 border border-white/10">
      <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
        <Star className="w-5 h-5 text-yellow-400" />
        <span>Success Stories</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="p-4 bg-white/5 rounded-lg border border-white/10"
          >
            <div className="flex items-center mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <p className="text-sm text-gray-300 mb-3">"{testimonial.quote}"</p>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white">
                {testimonial.name}
              </span>
              <span className="text-xs text-gray-400">
                {testimonial.location}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TestimonialsSection;
