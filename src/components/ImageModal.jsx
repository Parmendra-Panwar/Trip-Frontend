import { useEffect } from 'react';

const ImageModal = ({ images, currentIndex, setCurrentIndex, onClose }) => {

    useEffect(() => {
        // 1. Lock Scroll
        document.body.style.overflow = 'hidden';

        // 2. Keyboard Navigation
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);

        // Cleanup: Unlock Scroll and Remove Event
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentIndex]);

    const handleNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        // Overlay: Thoda transparent black aur blurred background
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">

            {/* Modal Container: Fixed width for Large screens, Full for Mobile */}
            <div className="relative w-full md:w-[75%] lg:w-[65%] h-[70vh] md:h-[85vh] bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center justify-center group">

                {/* Close Button: Top Right inside modal */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 z-[110] bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all border border-white/10"
                >
                    <span className="text-2xl">&times;</span>
                </button>

                {/* Left Navigation */}
                <button
                    onClick={handlePrev}
                    className="absolute left-4 z-[110] bg-black/40 text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Image Wrapper */}
                <div className="w-full h-full p-4 flex items-center justify-center bg-black/20">
                    <img
                        src={images[currentIndex]?.url}
                        className="max-w-full max-h-full object-contain drop-shadow-2xl animate-in zoom-in-95 duration-300"
                        alt={`Slide ${currentIndex + 1}`}
                    />
                </div>

                {/* Right Navigation */}
                <button
                    onClick={handleNext}
                    className="absolute right-4 z-[110] bg-black/40 text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* Bottom Indicators Bar */}
                <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-3 z-[110]">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`transition-all duration-300 rounded-full ${currentIndex === index
                                    ? 'w-8 h-2 bg-white'
                                    : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                    <span className="ml-4 text-xs font-mono text-white/60 tracking-widest">
                        {currentIndex + 1} / {images.length}
                    </span>
                </div>
            </div>

            {/* Backdrop click to close */}
            <div className="absolute inset-0 -z-10" onClick={onClose}></div>
        </div>
    );
};

export default ImageModal;