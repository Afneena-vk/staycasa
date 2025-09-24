

import { useState, useEffect } from "react";
import { authService } from "../../services/authService";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUpload,
  FaSave,
  FaSpinner,
} from "react-icons/fa";
import { useAuthStore } from "../../stores/authStore";
import { toast } from "react-toastify";


import Header from "./Header";
import Footer from "./Footer";

interface Address {
  houseNo: string;
  street: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
}

interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  profileImage: string;
  address?: Address;
}

const UserProfile = () => {
  const { userData, getUserProfile, updateUserProfile, updateUserData } =
    useAuthStore();

  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    profileImage: "",
    address: {
      houseNo: "",
      street: "",
      city: "",
      district: "",
      state: "",
      pincode: "",
    },
  });

const [imagePreview, setImagePreview] = useState<string | null>(null);
const [imageFile, setImageFile] = useState<File | null>(null);
const [uploadingImage, setUploadingImage] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        if (userData) {
          setProfile({
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            profileImage: userData.profileImage || "",
            address: userData.address || {
              houseNo: "",
              street: "",
              city: "",
              district: "",
              state: "",
              pincode: "",
            },
          });
        }

        const response = await getUserProfile();
        if (response && response.status === 200) {
          const profileData = {
            name: response.name || "",
            email: response.email || "",
            phone: response.phone || "",
            profileImage: response.profileImage || "",
            address: response.address || {
    //           name: userData.name || "",
    // email: userData.email || "",
    // phone: userData.phone || "",
    // profileImage: userData.profileImage || "",
    // address: userData.address || {
              houseNo: "",
              street: "",
              city: "",
              district: "",
              state: "",
              pincode: "",
            },
          };
          setProfile(profileData);
          updateUserData(profileData);
        }
      } catch (error: any) {
        console.error("Failed to load profile:", error);
        toast.error(
          error.response?.data?.error || "Failed to load profile data"
        );
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    loadProfile();
  }, [getUserProfile]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

 
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    toast.error('Please select a valid image file (JPEG, JPG, or PNG)');
    return;
  }

  if (file.size > 5 * 1024 * 1024) { 
    toast.error('Image size should be less than 5MB');
    return;
  }

  setImageFile(file);
  setImagePreview(URL.createObjectURL(file));
};

const uploadImage = async () => {
  if (!imageFile) return null;

  try {
    setUploadingImage(true);
    const response = await authService.uploadProfileImage(imageFile);

    const newImageUrl = response.profileImage || response.data?.profileImage;
    if (newImageUrl) {
      setProfile(prev => ({ ...prev, profileImage: newImageUrl }));
      
      updateUserData({ ...userData, profileImage: newImageUrl });
    }
    return response.imageUrl || response.profileImage;
  } catch (error: any) {
    toast.error('Failed to upload image');
    throw error;
  } finally {
    setUploadingImage(false);
  }
};

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field?: keyof Address
  ) => {
    const { name, value } = e.target;
    if (field) {
      setProfile({
        ...profile,
        address: {
          ...profile.address!,
          [field]: value,
        },
      });
    } else {
      setProfile({ ...profile, [name]: value });
    }  
    setErrors(prev => ({ ...prev, [field || name]: "" }));
  };  

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!profile.name.trim()) newErrors.name = "Name is required";

    if (profile.phone && !/^\d{10}$/.test(profile.phone.trim()))
      newErrors.phone = "Phone must be 10 digits";

    if (profile.address) {
      Object.entries(profile.address).forEach(([key, value]) => {
        if (!value.trim()) newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;  
          if (key === "pincode" && value.trim() && !/^\d+$/.test(value)) {
      newErrors[key] = "Pincode must contain only numbers";
    }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
     if (!validate()) return;
    try {
      setSaving(true);

       let profileImageUrl = profile.profileImage;

        if (imageFile) {
      profileImageUrl = await uploadImage();
    }

      const updateData = {
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
         ...(profileImageUrl && { profileImage: profileImageUrl }),
      };

      const response = await updateUserProfile(updateData);
      if (response && response.status === 200) {
        toast.success(response.message || "Profile updated successfully");
        setProfile((prev) => ({
          ...prev,
          // name: response.name,
          // phone: response.phone,
          // address: response.address,
          ...response.data 
        }));
        setImageFile(null);
        setImagePreview(null);
      }
    } catch (error: any) {
      console.error("Profile update failed:", error);
      toast.error(error.response?.data?.error || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (initialLoad && loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex justify-center items-center pt-20">
          <div className="flex items-center gap-3">
            <FaSpinner className="animate-spin text-indigo-600" size={24} />
            <span className="text-gray-600">Loading profile...</span>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 flex justify-center">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {/* Profile Header */}
          <div className="flex items-center gap-6 border-b pb-6 mb-6">
            
              <div className="relative">
    {/* {userData?.profileImage ? (
      <img
        src={userData.profileImage}
        alt="Profile"
        className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
      />
    ) : (
      <div className="w-28 h-28 rounded-full bg-blue-950 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-md">
        {profile.name?.charAt(0).toUpperCase() || "U"}
      </div>
    )}

              {/* <label */}
                {/* htmlFor="profileImage"
                className="absolute bottom-2 right-2 bg-blue-950 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-indigo-700 transition"
              >
                <FaUpload size={14} />
              </label> */} 
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
                />
              // ) : userData?.profileImage ? (
              //   <img
              //     src={userData.profileImage}
              //     alt="Profile"
               ) : profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-blue-950 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-md">
                  {profile.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}

              {/* Cancel button */}
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                  disabled={saving || uploadingImage}
                >
                  ✕
                </button>
              )}

              <label
                htmlFor="profileImage"
                className="absolute bottom-2 right-2 bg-blue-950 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {/* {uploadingImage ? (
                  <FaSpinner className="animate-spin" size={14} />
                ) : ( */}
                  <FaUpload size={14} />
                {/* )} */}
              </label>  

              <input
                type="file"
                id="profileImage"
                // accept="image/*"
                accept="image/jpeg,image/jpg,image/png"
                className="hidden"
                onChange={handleImageUpload}
                // disabled={saving}
                //disabled={saving || uploadingImage}
                disabled={uploadingImage}
              />
              {imageFile && (
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const imageUrl = await uploadImage();
                      //if (imageUrl) setProfile((prev) => ({ ...prev, profileImage: imageUrl }));

                      // toast.success("Profile image uploaded successfully");
                      // setImageFile(null);
                      // setImagePreview(null);
                      if (imageUrl) {
          toast.success("Profile image uploaded successfully");
          setProfile(prev => ({ ...prev, profileImage: imageUrl }));
          setImageFile(null);
          setImagePreview(null);
        }
                    } catch (err) {
                      console.error(err);
                      toast.error("Failed to upload image");
                    }
                  }}
                  className="absolute bottom-2 right-2 bg-green-600 text-white p-2 rounded-full shadow-md hover:bg-green-700 transition disabled:opacity-50"
                  disabled={uploadingImage}
                >
                  {uploadingImage ? <FaSpinner className="animate-spin" size={14} /> : "Upload"}
                </button>
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-blue-950">
                {profile.name}
              </h2>
              <p className="text-blue-950">{profile.email}</p>
            </div>
          </div>

          {/* Profile Form */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                <FaUser className="inline mr-2" /> Name
              </label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
                
                disabled={saving}
              /> 
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                <FaEnvelope className="inline mr-2" /> Email
              </label>
              <input
                type="email"
                name="email"
                value={profile.email}
                className="w-full px-4 py-2 rounded-xl border bg-gray-100 outline-none cursor-not-allowed"
                disabled
                title="Email cannot be changed"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                <FaPhone className="inline mr-2" /> Phone
              </label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
               
                disabled={saving}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}

            </div>

            {/* Address fields */}
            {profile.address &&
              (Object.keys(profile.address) as (keyof Address)[]).map(
                (field) => (
                  <div key={field} className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      <FaMapMarkerAlt className="inline mr-2" />{" "}
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type="text"
                      name={field}
                      value={profile.address?.[field] || ""}
                      onChange={(e) => handleChange(e, field)}
                      className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
                      disabled={saving}
                    />
                    {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                  </div>
                )
              )}

            {/* Save Button */}
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-blue-950 text-white px-6 py-3 rounded-xl shadow-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default UserProfile;
