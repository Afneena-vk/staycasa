

import React, { useState } from "react";
import OwnerLayout from "../../layouts/owner/OwnerLayout";
//import { authService } from "../../services/authService";
import { useAuthStore } from "../../stores/authStore";
import ImageCropper from "../../components/ImageCropper"; 

const AddProperty: React.FC = () => {
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
  const [amenities, setAmenities] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [filesToCrop, setFilesToCrop] = useState<File[]>([]);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

const { addProperty, isLoading, error, clearError } = useAuthStore();

  const handleAmenitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setAmenities([...amenities, value]);
    } else {
      setAmenities(amenities.filter((a) => a !== value));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      
      const files = Array.from(e.target.files);
      
      
       setFilesToCrop(files); 
      if (files.length > 0) {
        setCroppingImage(URL.createObjectURL(files[0])); 
      }
    }
  };


   const handleCropDone = (croppedBlob: Blob) => {
    const currentFile = filesToCrop[0];
    const croppedFile = new File([croppedBlob], currentFile.name, { type: "image/jpeg" });

    setImages((prev) => [...prev, croppedFile]);
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

   const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (!type) newErrors.type = "Property type is required";
    if (!houseNumber.trim()) newErrors.houseNumber = "House number is required";
    if (!street.trim()) newErrors.street = "Street is required";
    if (!city.trim()) newErrors.city = "City is required";
    if (!district.trim()) newErrors.district = "District is required";
    if (!state.trim()) newErrors.state = "State is required";
    if (!pincode || pincode.toString().length !== 6) newErrors.pincode = "Enter a valid 6-digit pincode";
    if (!pricePerMonth || pricePerMonth <= 0) newErrors.pricePerMonth = "Price per month must be greater than 0";
    if (!bedrooms || bedrooms < 0) newErrors.bedrooms = "Enter valid number of bedrooms";
    if (!bathrooms || bathrooms < 0) newErrors.bathrooms = "Enter valid number of bathrooms";
    if (!furnishing) newErrors.furnishing = "Select furnishing type";
    if (!maxGuests || maxGuests <= 0) newErrors.maxGuests = "Max guests must be greater than 0";
    if (!minLeasePeriod || minLeasePeriod <= 0) newErrors.minLeasePeriod = "Min lease period must be greater than 0";
    //if (!maxLeasePeriod || maxLeasePeriod < minLeasePeriod) newErrors.maxLeasePeriod = "Max lease period must be greater than or equal to min lease period";
    if (
  !maxLeasePeriod || 
  Number(maxLeasePeriod) < Number(minLeasePeriod)
) {
  newErrors.maxLeasePeriod = "Max lease period must be greater than or equal to min lease period";
}

    if (!description.trim()) newErrors.description = "Description is required";
    if (images.length === 0) newErrors.images = "Please upload at least one image";
    if (images.length > 5) newErrors.images = "Maximum 5 images allowed";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    clearError(); 

      if (!validate()) return;

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

    amenities.forEach((a) => formData.append("amenities", a));
    images.forEach((img) => formData.append("images", img));


   try {
   
      await addProperty(formData);
    
      alert("Property added successfully!");
      
      setTitle("");
      setType("");
      setHouseNumber("");
      setStreet("");
      setCity("");
      setDistrict("");
      setState("");
      setPincode("");
      setPricePerMonth("");
      setBedrooms("");
      setBathrooms("");
      setFurnishing("");
      setMaxGuests("");
      setMinLeasePeriod("");
      setMaxLeasePeriod("");
      setAmenities([]);
      setDescription("");
      setImages([]);
      setImagePreviews([]);
      setErrors({});
    
  } catch (error: any) {
    console.error("Error:", error);
    alert("Failed to add property: " + (error.response?.data?.error || error.message));
  }
};

  return (
    <OwnerLayout>
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6">Add New Property</h2>

       {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}


      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
          <div>
        <input
          type="text"
          placeholder="Property Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded-lg"
          
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
</div>
        {/* Type */}
         <div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border p-2 rounded-lg"
         
        >
          <option value="">Select Type</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Cottage">Cottage</option>
          <option value="Homestay">Homestay</option>
        </select>
          {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
        </div>

        {/* Address Section */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Enter Address Details</h3>
          <div className="grid grid-cols-2 gap-4">
             <div>
            <input
              type="text"
              placeholder="House Number"
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
              className="w-full border p-2 rounded-lg"
             
            />
            {errors.houseNumber && <p className="text-red-500 text-xs mt-1">{errors.houseNumber}</p>}
          </div>
          <div>
            <input
              type="text"
              placeholder="Street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full border p-2 rounded-lg"
              
            />
            {errors.street && <p className="text-red-500 text-xs mt-1">{errors.street}</p>}
            </div>
            <div>
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border p-2 rounded-lg"
              
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>
            <div>
            <input
              type="text"
              placeholder="District"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full border p-2 rounded-lg"
              
            />
            {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
            </div>
            <div>
            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full border p-2 rounded-lg"
              
            />
            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
            </div>
            <div>
            <input
              type="number"
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => setPincode(Number(e.target.value))}
              className="w-full border p-2 rounded-lg"
              
            />
            {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
            </div>
          </div>
        </div>

        {/* Price per Month */}
        <div>
        <input
          type="number"
          placeholder="Price per Month"
          value={pricePerMonth}
          onChange={(e) => setPricePerMonth(Number(e.target.value))}
          className="w-full border p-2 rounded-lg"
          
        />
        {errors.pricePerMonth && <p className="text-red-500 text-xs mt-1">{errors.pricePerMonth}</p>}
        </div>

        {/* Bedrooms & Bathrooms */}
        <div className="grid grid-cols-2 gap-4">
          <div>
          <input
            type="number"
            placeholder="Bedrooms"
            value={bedrooms}
            onChange={(e) => setBedrooms(Number(e.target.value))}
            className="w-full border p-2 rounded-lg"
          />
          {errors.bedrooms && <p className="text-red-500 text-xs mt-1">{errors.bedrooms}</p>}
          </div>
          <div>
          <input
            type="number"
            placeholder="Bathrooms"
            value={bathrooms}
            onChange={(e) => setBathrooms(Number(e.target.value))}
            className="w-full border p-2 rounded-lg"
          />
           {errors.bathrooms && <p className="text-red-500 text-xs mt-1">{errors.bathrooms}</p>}
          </div>
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
        {errors.furnishing && <p className="text-red-500 text-xs mt-1">{errors.furnishing}</p>}
        {/* Max Guests */}
        <input
          type="number"
          placeholder="Max Guests Allowed"
          value={maxGuests}
          onChange={(e) => setMaxGuests(Number(e.target.value))}
          className="w-full border p-2 rounded-lg"
          
        />
        {errors.maxGuests && <p className="text-red-500 text-xs mt-1">{errors.maxGuests}</p>}
        {/* Lease Period */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Min Lease Period (months)"
            value={minLeasePeriod}
            onChange={(e) => setMinLeasePeriod(Number(e.target.value))}
            className="w-full border p-2 rounded-lg"
            
          />
          {errors.minLeasePeriod && <p className="text-red-500 text-xs mt-1">{errors.minLeasePeriod}</p>}
          <input
            type="number"
            placeholder="Max Lease Period (months)"
            value={maxLeasePeriod}
            onChange={(e) => setMaxLeasePeriod(Number(e.target.value))}
            className="w-full border p-2 rounded-lg"
           
          />
          {errors.maxLeasePeriod && <p className="text-red-500 text-xs mt-1">{errors.maxLeasePeriod}</p>}
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
                  checked={amenities.includes(a)}
                  onChange={handleAmenitiesChange}
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
     {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        {/* Images */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />
 {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
         {imagePreviews.length > 0 && (
            <div className="flex gap-2 flex-wrap mt-3">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-20 h-20 object-cover rounded border"
                />
              ))}
            </div>
          )}


        {/* Submit */}
        {/* <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Add Property
        </button> */}
        <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-lg text-white font-medium ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Adding Property..." : "Add Property"}
          </button>
      </form>
    </div>

    {
      croppingImage && (
       <ImageCropper
       image={ croppingImage }
       onCropDone={handleCropDone}
       onCancel={handleCropCancel}
       />
      )
    }
    </OwnerLayout>
  );
};

export default AddProperty;
