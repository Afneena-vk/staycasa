

import { useState, useEffect } from "react";
import { authService } from "../../services/authService";
import { userService } from "../../services/userService";
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
import ChangePassword from "../common/ChangePassword";

// import Header from "./Header";
// import Footer from "./Footer";

import axios from "axios";

 const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
       error.response?.data?.error ||
      error.message ||
      "Something went wrong"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
};

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
  // profileImage: string;
    profileImage?: {
    url: string;
    publicId: string;
  }; 
  address?: Address;
}

const UserProfile = () => {
  const { userData, getUserProfile, updateUserProfile, updateUserData } =
    useAuthStore();

  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    // profileImage: "",
      profileImage: undefined,
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
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);


  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        if (userData) {
          setProfile({
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            // profileImage: userData.profileImage || "",
            profileImage: userData.profileImage || undefined, 
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
            // profileImage: response.profileImage || "",
            // profileImage: userData.profileImage || undefined, 
            profileImage: response.profileImage || undefined,
            address: response.address || {
    
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
      
      } catch (error: unknown) {
  console.error("Failed to load profile:", error);
  toast.error(getErrorMessage(error));

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
    const response = await userService.uploadProfileImage(imageFile);

    // const newImageUrl = response.profileImage || response.data?.profileImage;
    // if (newImageUrl) {
    //   setProfile(prev => ({ ...prev, profileImage: newImageUrl }));
      
    //   updateUserData({ ...userData, profileImage: newImageUrl });
    // }
    const newProfileImage = response.profileImage || response.data?.profileImage;
if (newProfileImage) {
  setProfile(prev => ({ ...prev, profileImage: newProfileImage }));
  updateUserData({ ...userData, profileImage: newProfileImage });
}

    // return response.imageUrl || response.profileImage;
    return newProfileImage;
  
  } catch (error: unknown) {
  toast.error(getErrorMessage(error));
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
    
    } catch (error: unknown) {
  console.error("Profile update failed:", error);
  toast.error(getErrorMessage(error));

    } finally {
      setSaving(false);
    }
  };

  if (initialLoad && loading) {
    return (
      <>
        {/* <Header /> */}
        <div className="min-h-screen bg-gray-50 flex justify-center items-center pt-20">
          <div className="flex items-center gap-3">
            <FaSpinner className="animate-spin text-indigo-600" size={24} />
            <span className="text-gray-600">Loading profile...</span>
          </div>
        </div>
        {/* <Footer /> */}
      </>
    );
  }

 
return (
  <div className="bg-slate-100 min-h-screen pt-20 pb-20 px-4 flex justify-center">
    <div className="w-full max-w-4xl flex flex-col gap-6">

      {/* PROFILE HEADER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6">

        <div className="relative">
          {imagePreview ? (
            <img
              src={imagePreview}
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
            />
          ) : profile.profileImage?.url ? (
            <img
              src={profile.profileImage.url}
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-900 to-blue-500 flex items-center justify-center text-white text-4xl font-bold shadow-md">
              {profile.name?.trim()?.[0]?.toUpperCase() || "U"}
            </div>
          )}

          {imagePreview && (
            <button
              type="button"
              onClick={() => {
                setImageFile(null);
                setImagePreview(null);
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 text-xs"
              disabled={saving || uploadingImage}
            >
              ✕
            </button>
          )}

          <label
            htmlFor="profileImage"
            className="absolute bottom-2 right-2 bg-blue-900 text-white p-2 rounded-full cursor-pointer"
          >
            <FaUpload size={12} />
          </label>

          <input
            type="file"
            id="profileImage"
            accept="image/jpeg,image/jpg,image/png"
            className="hidden"
            onChange={handleImageUpload}
            disabled={uploadingImage}
          />

          {imageFile && (
            <button
              type="button"
              onClick={async () => {
                try {
                  const imageUrl = await uploadImage();

                  if (imageUrl) {
                    toast.success("Profile image uploaded successfully");
                    setProfile((prev) => ({ ...prev, profileImage: imageUrl }));
                    setImageFile(null);
                    setImagePreview(null);
                  }
                } catch (error) {
                  console.error(error);
                  toast.error(getErrorMessage(error));
                }
              }}
              className="absolute bottom-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs shadow-md hover:bg-green-700"
              disabled={uploadingImage}
            >
              {uploadingImage ? (
                <FaSpinner className="animate-spin" size={12} />
              ) : (
                "Upload"
              )}
            </button>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            {profile.name}
          </h2>
          <p className="text-slate-500">{profile.email}</p>
        </div>
      </div>

      {/* PROFILE FORM */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1 h-5 bg-gradient-to-b from-blue-900 to-blue-500 rounded" />
          <h3 className="text-base font-bold text-slate-900">
            Profile Information
          </h3>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >

          {/* NAME */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              disabled={saving}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm bg-gray-100 cursor-not-allowed"
              disabled
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
              disabled={saving}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* ADDRESS */}
          {profile.address &&
            (Object.keys(profile.address) as (keyof Address)[]).map((field) => (
              <div key={field} className="md:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  name={field}
                  value={profile.address?.[field] || ""}
                  onChange={(e) => handleChange(e, field)}
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg text-sm bg-slate-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                  disabled={saving}
                />
                {errors[field] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[field]}
                  </p>
                )}
              </div>
            ))}

          {/* BUTTON */}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-900 to-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>

        {/* CHANGE PASSWORD */}
        <div className="mt-4 text-right">
          <span
            className="text-blue-600 font-medium cursor-pointer hover:underline"
            onClick={() => setShowChangePasswordModal(true)}
          >
            Change Password?
          </span>
        </div>
      </div>

      {/* MODAL */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowChangePasswordModal(false)}
              className="absolute top-3 right-3 text-gray-500"
            >
              ✕
            </button>

            <h2 className="text-lg font-bold mb-4">
              Change Password
            </h2>
            <ChangePassword />
          </div>
        </div>
      )}
    </div>
  </div>
);

};

export default UserProfile;
