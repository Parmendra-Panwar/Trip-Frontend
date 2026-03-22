import { useEffect } from 'react';

const ImageModal = ({ images, currentIndex, setCurrentIndex, onClose }) => {
    // Safety check
    if (!images || images.length === 0) return null;

    useEffect(() => {
        // Lock Scroll
        document.body.style.overflow = 'hidden';

        // Keyboard Navigation
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentIndex, images.length, onClose]);

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    // Stop click events from reaching the backdrop
    const handleContentClick = (e) => e.stopPropagation();

    return (
        // Backdrop Overlay
        <div
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center transition-all duration-300"
            onClick={onClose}
        >
            {/* Top Bar Controls */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-[110]">
                <div className="text-white/70 font-medium tracking-widest text-sm">
                    {currentIndex + 1} / {images.length}
                </div>
                <button
                    onClick={onClose}
                    className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Left Navigation */}
            {images.length > 1 && (
                <button
                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                    className="absolute left-4 md:left-8 z-[110] text-white/50 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all"
                >
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {/* Main Image Container */}
            <div
                className="relative w-full h-[80vh] md:h-[90vh] flex items-center justify-center px-16"
                onClick={handleContentClick}
            >
                <img
                    src={images[currentIndex]?.url}
                    className="max-w-full max-h-full object-contain rounded-md shadow-2xl transition-transform duration-300"
                    alt={`View ${currentIndex + 1}`}
                />
            </div>

            {/* Right Navigation */}
            {images.length > 1 && (
                <button
                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                    className="absolute right-4 md:right-8 z-[110] text-white/50 hover:text-white p-3 rounded-full hover:bg-white/10 transition-all"
                >
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            {/* Thumbnails (Bottom) */}
            {images.length > 1 && (
                <div
                    className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 px-4 z-[110]"
                    onClick={handleContentClick}
                >
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`relative h-14 rounded-md overflow-hidden transition-all duration-300 border-2 ${currentIndex === index
                                    ? 'w-20 border-white opacity-100'
                                    : 'w-14 border-transparent opacity-40 hover:opacity-100'
                                }`}
                        >
                            <img
                                src={img.url}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageModal;