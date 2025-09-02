

import React, { useState } from "react";
import OwnerLayout from "../../layouts/owner/OwnerLayout";
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
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

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

    // TODO: call your API (using axios/fetch)
    // console.log("Submitting property...", {
    //   title,
    //   type,
    //   houseNumber,
    //   street,
    //   city,
    //   district,
    //   state,
    //   pincode,
    //   pricePerMonth,
    //   bedrooms,
    //   bathrooms,
    //   furnishing,
    //   maxGuests,
    //   minLeasePeriod,
    //   maxLeasePeriod,
    //   description,
    //   amenities,
    //   images,
    // });
      try {
    const response = await fetch("/api/owner/add-property", {
      method: "POST",
      body: formData,
      credentials: "include", // ensures cookies/session are sent
    });

    const result = await response.json();

    if (response.ok) {
      alert("Property added successfully!");
      // Reset form fields here if needed
      // e.g. setTitle(""), setType(""), setImages([])
    } else {
      alert("Error: " + (result.error || "Something went wrong"));
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Failed to add property");
  }
  };

  return (
    <OwnerLayout>
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl p-6 mt-8">
      <h2 className="text-2xl font-bold mb-6">Add New Property</h2>

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

        {/* Address Section */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Enter Address Details</h3>
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

        {/* Images */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Add Property
        </button>
      </form>
    </div>
    </OwnerLayout>
  );
};

export default AddProperty;
