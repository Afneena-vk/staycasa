import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

interface ImageCropperProps {
  image: string;
  onCropDone: (croppedBlob: Blob) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ image, onCropDone, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(4 / 3); 

  const getCroppedImg = useCallback(async () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = image;

    await new Promise((resolve) => (img.onload = resolve));

    const size = Math.min(img.width, img.height);
    canvas.width = size;
    canvas.height = size;
    ctx.drawImage(img, 0, 0, size, size, 0, 0, size, size);

    canvas.toBlob((blob) => {
      if (blob) onCropDone(blob);
    }, "image/jpeg");
  }, [image, onCropDone]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50">
      <div className="relative w-[300px] h-[300px] bg-white">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          //aspect={4 / 3}  
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
        />
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={() => setAspect(4 / 3)}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          4:3
        </button>
        <button
          onClick={() => setAspect(16 / 9)}
          className="px-3 py-1 bg-green-500 text-white rounded"
        >
          16:9
        </button>
      </div>
      <div className="mt-4 flex gap-3">
        <button onClick={getCroppedImg} className="bg-blue-600 text-white px-4 py-2 rounded">
          Crop
        </button>
        <button onClick={onCancel} className="bg-gray-400 text-white px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ImageCropper;
