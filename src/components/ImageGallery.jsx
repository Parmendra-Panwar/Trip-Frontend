const ImageGallery = ({ images, openModal }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-[2rem] overflow-hidden h-[300px] md:h-[500px] mb-12 relative z-0">
            <div className="h-full cursor-pointer group" onClick={() => openModal(0)}>
                <img src={images[0]?.url} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Main" />
            </div>
            <div className="hidden md:grid grid-rows-2 gap-3 h-full">
                <div className="cursor-pointer overflow-hidden group" onClick={() => openModal(1)}>
                    <img src={images[1]?.url || images[0]?.url} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Secondary 1" />
                </div>
                <div className="cursor-pointer overflow-hidden group" onClick={() => openModal(2)}>
                    <img src={images[2]?.url || images[0]?.url} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Secondary 2" />
                </div>
            </div>
        </div>

    )
}

export default ImageGallery;
