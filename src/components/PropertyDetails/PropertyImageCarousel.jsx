import { useState } from "react";
import { ChevronLeft, ChevronRight, X, Image as ImageIcon } from "lucide-react";

// Component to handle image with placeholder icon fallback
const ImageWithPlaceholder = ({ src, alt, className, onClick, placeholderClassName, iconSize = "w-16 h-16", showText = true }) => {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div className={placeholderClassName || "w-full h-full flex flex-col items-center justify-center bg-gray-800/50"}>
        <ImageIcon className={`${iconSize} text-gray-400 ${showText ? 'mb-2' : ''}`} />
        {showText && <p className="text-gray-400 text-sm">Image not available</p>}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onClick={onClick}
      onError={() => setImageError(true)}
    />
  );
};

const PropertyImageCarousel = ({ images = [], propertyAddress = "" }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-400">
          <svg
            className="w-16 h-16 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p>No images available</p>
        </div>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const currentImage = images[currentIndex];
  const imageUrl = typeof currentImage === 'string' 
    ? (currentImage.startsWith('http') ? currentImage : `/images/${currentImage}`)
    : null;

  return (
    <>
      <div className="relative w-full">
        {/* Main Image */}
        <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-gray-900 rounded-lg overflow-hidden group">
          <ImageWithPlaceholder
            src={imageUrl}
            alt={`${propertyAddress} - Image ${currentIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer"
            onClick={openFullscreen}
            placeholderClassName="w-full h-full flex flex-col items-center justify-center bg-gray-800/50"
            iconSize="w-16 h-16 sm:w-20 sm:h-20"
            showText={true}
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Fullscreen Button */}
          {images.length > 0 && (
            <button
              onClick={openFullscreen}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
              aria-label="View fullscreen"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="mt-3 sm:mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((image, index) => {
              const thumbUrl = typeof image === 'string'
                ? (image.startsWith('http') ? image : `/images/${image}`)
                : null;
              
              return (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? "border-purple-500 ring-2 ring-purple-500/50"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <ImageWithPlaceholder
                    src={thumbUrl}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    placeholderClassName="w-full h-full bg-gray-800 flex items-center justify-center"
                    iconSize="w-6 h-6"
                    showText={false}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeFullscreen}
        >
          <button
            onClick={closeFullscreen}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
            aria-label="Close fullscreen"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative max-w-7xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <ImageWithPlaceholder
              src={imageUrl}
              alt={`${propertyAddress} - Image ${currentIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
              placeholderClassName="w-full h-full min-h-[50vh] flex flex-col items-center justify-center bg-gray-900"
              iconSize="w-24 h-24"
              showText={true}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full">
                  {currentIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PropertyImageCarousel;

