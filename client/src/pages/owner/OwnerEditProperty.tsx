
// import React, { useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import OwnerLayout from "../../layouts/owner/OwnerLayout";
// import { useAuthStore } from "../../stores/authStore";

// const OwnerPropertyDetails: React.FC = () => {
//   const { propertyId } = useParams<{ propertyId: string }>();
//   const navigate = useNavigate();

//   const {
//     selectedProperty,
//     getOwnerPropertyById,
//     isLoading,
//     error,
//     clearError,
//   } = useAuthStore();

//   // Fetch property details on mount
//   useEffect(() => {
//     if (!propertyId) return;
//     getOwnerPropertyById(propertyId);
//   }, [propertyId, getOwnerPropertyById]);

//   if (isLoading) {
//     return (
//       <OwnerLayout>
//         <div className="text-center mt-10">Loading property details...</div>
//       </OwnerLayout>
//     );
//   }

//   if (error) {
//     return (
//       <OwnerLayout>
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-6">
//           {error}
//           <button
//             onClick={clearError}
//             className="ml-4 text-blue-600 underline"
//           >
//             Dismiss
//           </button>
//         </div>
//       </OwnerLayout>
//     );
//   }

//   if (!selectedProperty) {
//     return (
//       <OwnerLayout>
//         <div className="text-center mt-10">Property not found.</div>
//       </OwnerLayout>
//     );
//   }

//   const {
//     title,
//     type,
//     houseNumber,
//     street,
//     city,
//     district,
//     state,
//     pincode,
//     bedrooms,
//     bathrooms,
//     furnishing,
//     pricePerMonth,
//     maxGuests,
//     minLeasePeriod,
//     maxLeasePeriod,
//     features,
//     description,
//     images,
//     status,
//     createdAt,
//   } = selectedProperty;

//   return (
//     <OwnerLayout>
//       <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-8">
//         <h2 className="text-2xl font-bold mb-4">{title}</h2>
//         <p className="text-gray-600 mb-2">
//           Type: <strong>{type}</strong>
//         </p>
//         <p className="text-gray-600 mb-2">
//           Status:{" "}
//           <strong
//             className={
//               status === "approved"
//                 ? "text-green-600"
//                 : status === "pending"
//                 ? "text-yellow-600"
//                 : "text-red-600"
//             }
//           >
//             {status}
//           </strong>
//         </p>
//         <p className="text-gray-600 mb-4">
//           Added on: {new Date(createdAt).toLocaleDateString()}
//         </p>

//         <h3 className="font-semibold mb-2">Address</h3>
//         <p className="mb-4">
//           {houseNumber}, {street}, {city}, {district}, {state} - {pincode}
//         </p>

//         <h3 className="font-semibold mb-2">Details</h3>
//         <div className="grid grid-cols-2 gap-4 mb-4">
//           <p>Bedrooms: {bedrooms}</p>
//           <p>Bathrooms: {bathrooms}</p>
//           <p>Furnishing: {furnishing}</p>
//           <p>Price/Month: ${pricePerMonth}</p>
//           <p>Max Guests: {maxGuests}</p>
//           <p>
//             Lease Period: {minLeasePeriod} - {maxLeasePeriod} months
//           </p>
//         </div>

//         <h3 className="font-semibold mb-2">Amenities</h3>
//         <ul className="list-disc ml-5 mb-4">
//           {features.map((f, idx) => (
//             <li key={idx}>{f}</li>
//           ))}
//         </ul>

//         <h3 className="font-semibold mb-2">Description</h3>
//         <p className="mb-4">{description}</p>

//         {images.length > 0 && (
//           <div>
//             <h3 className="font-semibold mb-2">Images</h3>
//             <div className="flex gap-2 flex-wrap">
//               {images.map((img, index) => (
//                 <img
//                   key={index}
//                   src={img}
//                   alt={`Property ${index}`}
//                   className="w-32 h-32 object-cover rounded border"
//                 />
//               ))}
//             </div>
//           </div>
//         )}

//         <button
//           onClick={() => navigate(`/owner/properties/edit/${propertyId}`)}
//           className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           Edit Property
//         </button>
//       </div>
//     </OwnerLayout>
//   );
// };

// export default OwnerPropertyDetails;

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import OwnerLayout from "../../layouts/owner/OwnerLayout";
// import { useAuthStore } from "../../stores/authStore";
// import ImageCropper from "../../components/ImageCropper";
// import { FaTimes } from "react-icons/fa";

// const OwnerEditProperty: React.FC = () => {
//   const { propertyId } = useParams<{ propertyId: string }>();
//   const {
//     selectedProperty,
//     getOwnerPropertyById,
//     //updateProperty,
//     isLoading,
//     error,
//     clearError,
//   } = useAuthStore();

//   // States for property fields
//   const [title, setTitle] = useState("");
//   const [type, setType] = useState("");
//   const [houseNumber, setHouseNumber] = useState("");
//   const [street, setStreet] = useState("");
//   const [city, setCity] = useState("");
//   const [district, setDistrict] = useState("");
//   const [state, setState] = useState("");
//   const [pincode, setPincode] = useState<number | "">("");
//   const [pricePerMonth, setPricePerMonth] = useState<number | "">("");
//   const [bedrooms, setBedrooms] = useState<number | "">("");
//   const [bathrooms, setBathrooms] = useState<number | "">("");
//   const [furnishing, setFurnishing] = useState("");
//   const [maxGuests, setMaxGuests] = useState<number | "">("");
//   const [minLeasePeriod, setMinLeasePeriod] = useState<number | "">("");
//   const [maxLeasePeriod, setMaxLeasePeriod] = useState<number | "">("");
//   const [amenities, setAmenities] = useState<string[]>([]);
//   const [description, setDescription] = useState("");

//   // Images
//   const [existingImages, setExistingImages] = useState<string[]>([]);
//   const [newImages, setNewImages] = useState<File[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);
//   const [filesToCrop, setFilesToCrop] = useState<File[]>([]);
//   const [croppingImage, setCroppingImage] = useState<string | null>(null);

//   // 🔹 Load property details
//   useEffect(() => {
//     if (propertyId) {
//       getOwnerPropertyById(propertyId);
//     }
//   }, [propertyId, getOwnerPropertyById]);

//   useEffect(() => {
//     if (selectedProperty) {
//       setTitle(selectedProperty.title || "");
//       setType(selectedProperty.type || "");
//       setHouseNumber(selectedProperty.houseNumber || "");
//       setStreet(selectedProperty.street || "");
//       setCity(selectedProperty.city || "");
//       setDistrict(selectedProperty.district || "");
//       setState(selectedProperty.state || "");
//       setPincode(selectedProperty.pincode || "");
//       setPricePerMonth(selectedProperty.pricePerMonth || "");
//       setBedrooms(selectedProperty.bedrooms || "");
//       setBathrooms(selectedProperty.bathrooms || "");
//       setFurnishing(selectedProperty.furnishing || "");
//       setMaxGuests(selectedProperty.maxGuests || "");
//       setMinLeasePeriod(selectedProperty.minLeasePeriod || "");
//       setMaxLeasePeriod(selectedProperty.maxLeasePeriod || "");
//       setAmenities(selectedProperty.features || []);
//       setDescription(selectedProperty.description || "");
//       setExistingImages(selectedProperty.images || []);
//     }
//   }, [selectedProperty]);

//   // 🔹 Amenities handler
//   const handleAmenitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value, checked } = e.target;
//     if (checked) {
//       setAmenities([...amenities, value]);
//     } else {
//       setAmenities(amenities.filter((a) => a !== value));
//     }
//   };

//   // 🔹 Handle new image uploads
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       const files = Array.from(e.target.files);
//       setFilesToCrop(files);
//       if (files.length > 0) {
//         setCroppingImage(URL.createObjectURL(files[0]));
//       }
//     }
//   };

//   // 🔹 Cropping logic
//   const handleCropDone = (croppedBlob: Blob) => {
//     const currentFile = filesToCrop[0];
//     const croppedFile = new File([croppedBlob], currentFile.name, {
//       type: "image/jpeg",
//     });

//     setNewImages((prev) => [...prev, croppedFile]);
//     setImagePreviews((prev) => [...prev, URL.createObjectURL(croppedFile)]);

//     const remaining = filesToCrop.slice(1);
//     setFilesToCrop(remaining);

//     if (remaining.length > 0) {
//       setCroppingImage(URL.createObjectURL(remaining[0]));
//     } else {
//       setCroppingImage(null);
//     }
//   };

//   const handleCropCancel = () => {
//     const remaining = filesToCrop.slice(1);
//     setFilesToCrop(remaining);

//     if (remaining.length > 0) {
//       setCroppingImage(URL.createObjectURL(remaining[0]));
//     } else {
//       setCroppingImage(null);
//     }
//   };

//   // 🔹 Remove existing image
//   const handleRemoveExistingImage = (index: number) => {
//     setExistingImages((prev) => prev.filter((_, i) => i !== index));
//   };

//   // 🔹 Remove new image
//   const handleRemoveNewImage = (index: number) => {
//     setNewImages((prev) => prev.filter((_, i) => i !== index));
//     setImagePreviews((prev) => prev.filter((_, i) => i !== index));
//   };

//   // 🔹 Submit form
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     clearError();

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("type", type);
//     formData.append("houseNumber", houseNumber);
//     formData.append("street", street);
//     formData.append("city", city);
//     formData.append("district", district);
//     formData.append("state", state);
//     formData.append("pincode", String(pincode));
//     formData.append("pricePerMonth", String(pricePerMonth));
//     formData.append("bedrooms", String(bedrooms));
//     formData.append("bathrooms", String(bathrooms));
//     formData.append("furnishing", furnishing);
//     formData.append("maxGuests", String(maxGuests));
//     formData.append("minLeasePeriod", String(minLeasePeriod));
//     formData.append("maxLeasePeriod", String(maxLeasePeriod));
//     formData.append("description", description);

//     amenities.forEach((a) => formData.append("amenities", a));
//     existingImages.forEach((img) => formData.append("existingImages", img));
//     newImages.forEach((img) => formData.append("newImages", img));

//     try {
//       //await updateProperty(propertyId!, formData);
//       alert("Property updated successfully!");
//     } catch (err: any) {
//       console.error("Error updating property:", err);
//       alert("Failed to update property");
//     }
//   };

//   return (
//     <OwnerLayout>
//       <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-8">
//         <h2 className="text-2xl font-bold mb-6">Edit Property</h2>

//         {error && (
//           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* 🔹 Title */}
//           <input
//             type="text"
//             placeholder="Property Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full border p-2 rounded-lg"
//             required
//           />

//           {/* 🔹 Type */}
//           <select
//             value={type}
//             onChange={(e) => setType(e.target.value)}
//             className="w-full border p-2 rounded-lg"
//             required
//           >
//             <option value="">Select Type</option>
//             <option value="Apartment">Apartment</option>
//             <option value="Villa">Villa</option>
//             <option value="Cottage">Cottage</option>
//             <option value="Farmhouse">Farmhouse</option>
//             <option value="Homestay">Homestay</option>
//           </select>

//           {/* 🔹 Address */}
//           <div className="border rounded-lg p-4">
//             <h3 className="font-semibold mb-2">Address</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 placeholder="House Number"
//                 value={houseNumber}
//                 onChange={(e) => setHouseNumber(e.target.value)}
//                 className="w-full border p-2 rounded-lg"
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="Street"
//                 value={street}
//                 onChange={(e) => setStreet(e.target.value)}
//                 className="w-full border p-2 rounded-lg"
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="City"
//                 value={city}
//                 onChange={(e) => setCity(e.target.value)}
//                 className="w-full border p-2 rounded-lg"
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="District"
//                 value={district}
//                 onChange={(e) => setDistrict(e.target.value)}
//                 className="w-full border p-2 rounded-lg"
//                 required
//               />
//               <input
//                 type="text"
//                 placeholder="State"
//                 value={state}
//                 onChange={(e) => setState(e.target.value)}
//                 className="w-full border p-2 rounded-lg"
//                 required
//               />
//               <input
//                 type="number"
//                 placeholder="Pincode"
//                 value={pincode}
//                 onChange={(e) => setPincode(Number(e.target.value))}
//                 className="w-full border p-2 rounded-lg"
//                 required
//               />
//             </div>
//           </div>

//           {/* 🔹 Images */}
//           <div>
//             <h3 className="font-semibold mb-2">Images</h3>
//             <div className="flex gap-2 flex-wrap mb-4">
//               {existingImages.map((img, idx) => (
//                 <div key={idx} className="relative">
//                   <img
//                     src={img}
//                     alt={`Property ${idx}`}
//                     className="w-20 h-20 object-cover rounded border"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveExistingImage(idx)}
//                     className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full"
//                   >
//                     <FaTimes size={12} />
//                   </button>
//                 </div>
//               ))}

//               {imagePreviews.map((preview, idx) => (
//                 <div key={idx} className="relative">
//                   <img
//                     src={preview}
//                     alt={`New Preview ${idx}`}
//                     className="w-20 h-20 object-cover rounded border"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveNewImage(idx)}
//                     className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full"
//                   >
//                     <FaTimes size={12} />
//                   </button>
//                 </div>
//               ))}
//             </div>

//             <input
//               type="file"
//               multiple
//               accept="image/*"
//               onChange={handleImageChange}
//               className="w-full"
//             />
//           </div>

//           {/* 🔹 Submit */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className={`w-full py-2 rounded-lg text-white font-medium ${
//               isLoading
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             {isLoading ? "Updating..." : "Update Property"}
//           </button>
//         </form>
//       </div>

//       {croppingImage && (
//         <ImageCropper
//           image={croppingImage}
//           onCropDone={handleCropDone}
//           onCancel={handleCropCancel}
//         />
//       )}
//     </OwnerLayout>
//   );
// };

// export default OwnerEditProperty;


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import OwnerLayout from "../../layouts/owner/OwnerLayout";
import { useAuthStore } from "../../stores/authStore";
import ImageCropper from "../../components/ImageCropper";
import { FaTimes } from "react-icons/fa";

const OwnerEditProperty: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const {
    selectedProperty,
    getOwnerPropertyById,
    updateProperty,
    isLoading,
    error,
    clearError,
  } = useAuthStore();

  // States for property fields
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState<number | "">("");
  const [pricePerMonth, setPricePerMonth] = useState<number | "">("");
  const [bedrooms, setBedrooms] = useState<number | "">("");
  const [bathrooms, setBathrooms] = useState<number | "">("");
  const [furnishing, setFurnishing] = useState("");
  const [maxGuests, setMaxGuests] = useState<number | "">("");
  const [minLeasePeriod, setMinLeasePeriod] = useState<number | "">("");
  const [maxLeasePeriod, setMaxLeasePeriod] = useState<number | "">("");
  //const [amenities, setAmenities] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);

  const [description, setDescription] = useState("");

  // Images
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [filesToCrop, setFilesToCrop] = useState<File[]>([]);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
   const [imageError, setImageError] = useState<string | null>(null);

  // 🔹 Load property details
  useEffect(() => {
    if (propertyId) {
      getOwnerPropertyById(propertyId);
    }
  }, [propertyId, getOwnerPropertyById]);

  useEffect(() => {
    if (selectedProperty) {
      setTitle(selectedProperty.title || "");
      setType(selectedProperty.type || "");
      setHouseNumber(selectedProperty.houseNumber || "");
      setStreet(selectedProperty.street || "");
      setCity(selectedProperty.city || "");
      setDistrict(selectedProperty.district || "");
      setState(selectedProperty.state || "");
      setPincode(selectedProperty.pincode || "");
      setPricePerMonth(selectedProperty.pricePerMonth || "");
      setBedrooms(selectedProperty.bedrooms || "");
      setBathrooms(selectedProperty.bathrooms || "");
      setFurnishing(selectedProperty.furnishing || "");
      setMaxGuests(selectedProperty.maxGuests || "");
      setMinLeasePeriod(selectedProperty.minLeasePeriod || "");
      setMaxLeasePeriod(selectedProperty.maxLeasePeriod || "");
      //setAmenities(selectedProperty.features || []);
      setFeatures(selectedProperty.features || []);
      setDescription(selectedProperty.description || "");
      setExistingImages(selectedProperty.images || []);
      

    }
  }, [selectedProperty]);
// Add cleanup for image previews
useEffect(() => {
  return () => {
    // Cleanup image preview URLs when component unmounts
    imagePreviews.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
  };
}, [imagePreviews]);

// Add this useEffect to refresh property after update
useEffect(() => {
  if (selectedProperty && propertyId) {
    // Clear new images and previews after successful update
    setNewImages([]);
    setImagePreviews(prev => {
      prev.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      return [];
    });
  }
}, [selectedProperty?.images]); // Trigger when images change after update
  // 🔹 Amenities handler
//   const handleAmenitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value, checked } = e.target;
//     if (checked) {
//       setAmenities([...amenities, value]);
//     } else {
//       setAmenities(amenities.filter((a) => a !== value));
//     }
//   };

const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { value, checked } = e.target;
  if (checked) {
    setFeatures([...features, value]);
  } else {
    setFeatures(features.filter((f) => f !== value));
  }
};


  // 🔹 Handle new image uploads
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
   if (existingImages.length + newImages.length + files.length > 5) {
     // alert(`You can upload a maximum of 5 images. You already have ${existingImages.length + newImages.length} images.`);
     setImageError(
          `You can upload a maximum of 5 images. You already have ${
            existingImages.length + newImages.length
          } images.`
        );
      return;
    }

       setImageError(null);
      
      setFilesToCrop(files);
      if (files.length > 0) {
        setCroppingImage(URL.createObjectURL(files[0]));
      }
    }
  };

  // 🔹 Cropping logic
  const handleCropDone = (croppedBlob: Blob) => {
    const currentFile = filesToCrop[0];
    const croppedFile = new File([croppedBlob], currentFile.name, {
      type: "image/jpeg",
    });

    setNewImages((prev) => [...prev, croppedFile]);
    setImagePreviews((prev) => [...prev, URL.createObjectURL(croppedFile)]);

    const remaining = filesToCrop.slice(1);
    setFilesToCrop(remaining);

    if (remaining.length > 0) {
      setCroppingImage(URL.createObjectURL(remaining[0]));
    } else {
      setCroppingImage(null);
    }
  };

  const handleCropCancel = () => {
    const remaining = filesToCrop.slice(1);
    setFilesToCrop(remaining);

    if (remaining.length > 0) {
      setCroppingImage(URL.createObjectURL(remaining[0]));
    } else {
      setCroppingImage(null);
    }
  };

  // 🔹 Remove existing image
  const handleRemoveExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔹 Remove new image
  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔹 Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

  // const totalImages = existingImages.length + newImages.length;
  // if (totalImages > 5) {
  //   alert("You can upload a maximum of 5 images in total.");
  //   return;
  // }

   if (existingImages.length + newImages.length > 5) {
      setImageError(
        `You can upload a maximum of 5 images. You already have ${
          existingImages.length + newImages.length
        } images.`
      );
      return;
    }

    setImageError(null); // clear error on valid submit


    const formData = new FormData();
    formData.append("title", title);
    formData.append("type", type);
    formData.append("houseNumber", houseNumber);
    formData.append("street", street);
    formData.append("city", city);
    formData.append("district", district);
    formData.append("state", state);
    formData.append("pincode", String(pincode));
    formData.append("pricePerMonth", String(pricePerMonth));
    formData.append("bedrooms", String(bedrooms));
    formData.append("bathrooms", String(bathrooms));
    formData.append("furnishing", furnishing);
    formData.append("maxGuests", String(maxGuests));
    formData.append("minLeasePeriod", String(minLeasePeriod));
    formData.append("maxLeasePeriod", String(maxLeasePeriod));
    formData.append("description", description);

    // amenities.forEach((a) => formData.append("amenities", a));
    // existingImages.forEach((img) => formData.append("existingImages", img));
    // newImages.forEach((img) => formData.append("newImages", img));  

    
        //amenities.forEach((a) => formData.append("amenities", a));
        features.forEach((f) => formData.append("features", f));
        newImages.forEach((img) => formData.append("images", img));
        formData.append("existingImages", JSON.stringify(existingImages));

    try {
      await updateProperty(propertyId!, formData);
      await getOwnerPropertyById(propertyId!);
      alert("Property updated successfully!");
    } catch (err: any) {
      console.error("Error updating property:", err);
      alert("Failed to update property");
    }
  };

  return (
    <OwnerLayout>
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-8">
        <h2 className="text-2xl font-bold mb-6">Edit Property</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

                {/* Display image error */}
        {imageError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {imageError}
          </div>
        )}


        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <input
            type="text"
            placeholder="Property Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded-lg"
            required
          />

          {/* Type */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border p-2 rounded-lg"
            required
          >
            <option value="">Select Type</option>
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Cottage">Cottage</option>
            <option value="Farmhouse">Farmhouse</option>
            <option value="Homestay">Homestay</option>
          </select>

          {/* Address */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Address</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="House Number"
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
                className="w-full border p-2 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="Street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full border p-2 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border p-2 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="District"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full border p-2 rounded-lg"
                required
              />
              <input
                type="text"
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full border p-2 rounded-lg"
                required
              />
              <input
                type="number"
                placeholder="Pincode"
                value={pincode}
                onChange={(e) => setPincode(Number(e.target.value))}
                className="w-full border p-2 rounded-lg"
                required
              />
            </div>
          </div>

          {/* Price per Month */}
          <input
            type="number"
            placeholder="Price per Month"
            value={pricePerMonth}
            onChange={(e) => setPricePerMonth(Number(e.target.value))}
            className="w-full border p-2 rounded-lg"
            required
          />

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Bedrooms"
              value={bedrooms}
              onChange={(e) => setBedrooms(Number(e.target.value))}
              className="w-full border p-2 rounded-lg"
            />
            <input
              type="number"
              placeholder="Bathrooms"
              value={bathrooms}
              onChange={(e) => setBathrooms(Number(e.target.value))}
              className="w-full border p-2 rounded-lg"
            />
          </div>

          {/* Furnishing */}
          <select
            value={furnishing}
            onChange={(e) => setFurnishing(e.target.value)}
            className="w-full border p-2 rounded-lg"
          >
            <option value="">Furnishing</option>
            <option value="Fully-Furnished">Fully Furnished</option>
            <option value="Semi-Furnished">Semi Furnished</option>
            <option value="Not Furnished">Not Furnished</option>
          </select>

          {/* Max Guests */}
          <input
            type="number"
            placeholder="Max Guests Allowed"
            value={maxGuests}
            onChange={(e) => setMaxGuests(Number(e.target.value))}
            className="w-full border p-2 rounded-lg"
            required
          />

          {/* Lease Period */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Min Lease Period (months)"
              value={minLeasePeriod}
              onChange={(e) => setMinLeasePeriod(Number(e.target.value))}
              className="w-full border p-2 rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Max Lease Period (months)"
              value={maxLeasePeriod}
              onChange={(e) => setMaxLeasePeriod(Number(e.target.value))}
              className="w-full border p-2 rounded-lg"
              required
            />
          </div>

          {/* Amenities */}
          <div>
            <label className="font-semibold">Amenities</label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {["WiFi", "AC", "Parking", "Kitchen", "TV", "Pool"].map((a) => (
                <label key={a} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    value={a}
                    // checked={amenities.includes(a)}
                    // onChange={handleAmenitiesChange}
                    checked={features.includes(a)}
                    onChange={handleFeaturesChange}

                  />
                  {a}
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <textarea
            placeholder="Property Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded-lg"
            rows={4}
          />

          {/* Images */}
          <div>
            <h3 className="font-semibold mb-2">Images</h3>
            <div className="flex gap-2 flex-wrap mb-4">
              {existingImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={img}
                    alt={`Property ${idx}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}

              {imagePreviews.map((preview, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={preview}
                    alt={`New Preview ${idx}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full"
                  >
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
            </div>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-lg text-white font-medium ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Updating..." : "Update Property"}
          </button>
        </form>
      </div>

      {croppingImage && (
        <ImageCropper
          image={croppingImage}
          onCropDone={handleCropDone}
          onCancel={handleCropCancel}
        />
      )}
    </OwnerLayout>
  );
};

export default OwnerEditProperty;
