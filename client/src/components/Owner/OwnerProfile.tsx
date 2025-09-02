import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaBuilding, FaMapMarkerAlt, FaUpload, FaSave, FaSpinner } from "react-icons/fa";
import OwnerLayout from "../../layouts/owner/OwnerLayout";
import { useAuthStore } from "../../stores/authStore";
import { toast } from "react-toastify";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessAddress: string;
  //profileImage: string;
  approvalStatus: "pending" | "approved" | "rejected"; // ✅ new
  documents: string[]; // ✅ new
}

const OwnerProfile = () => {
  const { userData, getOwnerProfile, updateOwnerProfile, updateUserData, uploadDocument } = useAuthStore();
  
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessAddress: "",
    // profileImage: "",
     approvalStatus: "pending",
    documents: [],
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const [documentFile, setDocumentFile] = useState<File | null>(null);
   
  const [uploading, setUploading] = useState(false);


  
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        
        
        if (userData) {
          setProfile({
            name: userData.name || "",
            email: userData.email || "",
            phone: userData.phone || "",
            businessName: userData.businessName || "",
            businessAddress: userData.businessAddress || "",
            //profileImage: userData.profileImage || "",
            approvalStatus: userData.approvalStatus || "pending",
            documents: userData.documents || [],
          });
        }
        
       
        const response = await getOwnerProfile();
        if (response && response.status === 200) {
          const profileData = {
            name: response.name || "",
            email: response.email || "",
            phone: response.phone || "",
            businessName: response.businessName || "",
            businessAddress: response.businessAddress || "",
            //profileImage: response.profileImage || "",
            approvalStatus: response.approvalStatus || "pending",
            documents: response.documents || [],
          };
          
          setProfile(profileData);
          
         
          updateUserData(profileData);
        }
      } catch (error: any) {
        console.error("Failed to load profile:", error);
        toast.error(error.response?.data?.error || "Failed to load profile data");
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    };

    loadProfile();
  // }, [getOwnerProfile, userData, updateUserData]);
   }, [getOwnerProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
    
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }
      
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        //const base64String = e.target?.result as string;
        // setProfile({ ...profile, profileImage: base64String });
        setProfile({ ...profile });
      };
      reader.readAsDataURL(file);
    }
  };


   const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] ) {
       const file = e.target.files[0];
      //const files = Array.from(e.target.files);

      if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
        toast.error("Only image or PDF documents are allowed");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setDocumentFile(file);
    }
  };


const handleDocumentUpload = async () => {
  if (!documentFile) {
    toast.error("Please select a document first");
    return;
  }

  try {
    setUploading(true);
    const response = await uploadDocument(documentFile);

    if (response) {
      toast.success(response.message || "Document uploaded successfully");

      const updated = await getOwnerProfile();
      if (updated && updated.status === 200) {
        setProfile(prev => ({
          ...prev,
          documents: updated.documents || [],
          approvalStatus: updated.approvalStatus || prev.approvalStatus,
        }));
      }

      setDocumentFile(null);
      const fileInput = document.getElementById("documentUpload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    }
  } catch (error: any) {
    toast.error(error.response?.data?.error || "Upload failed. Try again later.");
  } finally {
    setUploading(false);
  }
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
     
      const updateData = {
        name: profile.name,
        phone: profile.phone,
        businessName: profile.businessName,
        businessAddress: profile.businessAddress,
        
      };

      const response = await updateOwnerProfile(updateData);
      
      if (response && response.status === 200) {
        toast.success(response.message || "Profile updated successfully");
        
      
        if (response.name) {
          setProfile(prev => ({
            ...prev,
            name: response.name,
            phone: response.phone,
            businessName: response.businessName,
            businessAddress: response.businessAddress,
           
          }));
        }
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
      <OwnerLayout>
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <div className="flex items-center gap-3">
            <FaSpinner className="animate-spin text-indigo-600" size={24} />
            <span className="text-gray-600">Loading profile...</span>
          </div>
        </div>
      </OwnerLayout>
    );
  }

  return (
    <OwnerLayout>
      <div className="min-h-screen bg-gray-50 py-10 px-6 flex justify-center items-center">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          {/* Profile Header */}
          <div className="flex items-center gap-6 border-b pb-6 mb-6">
            {/* <div className="relative">
              <img
                // src={profile.profileImage || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
              /> */}
              <div className="relative">
    {userData?.profileImage ? (
      <img
        src={userData.profileImage}
        alt="Profile"
        className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
      />
    ) : (
      <div className="w-28 h-28 rounded-full bg-blue-950 flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-md">
        {profile.name?.charAt(0).toUpperCase() || "O"}
      </div>
    )}
              {/* <label
                htmlFor="profileImage"
                className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-indigo-700 transition"
              >
                <FaUpload size={14} />
              </label> */}
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={saving}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
              <p className="text-gray-500">{profile.businessName}</p>
            </div>
          </div>

          {/* Profile Form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                required
                disabled={saving}
              />
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
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
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
                required
                disabled={saving}
              />
            </div>

            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                <FaBuilding className="inline mr-2" /> Business Name
              </label>
              <input
                type="text"
                name="businessName"
                value={profile.businessName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
                required
                disabled={saving}
              />
            </div>

            {/* Business Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                <FaMapMarkerAlt className="inline mr-2" /> Business Address
              </label>
              <input
                type="text"
                name="businessAddress"
                value={profile.businessAddress}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none disabled:bg-gray-100"
                required
                disabled={saving}
              />
            </div>

            {/* Save Button */}
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
        
        
          {/* 🔹 Verification Section */}
          {profile.approvalStatus !== "approved" && (
            <div className="mt-10 p-6 border rounded-xl bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Account Verification
              </h3>

              {profile.approvalStatus === "pending" && (
                <p className="text-yellow-600 mb-3">
                  Your account is under review. Please upload a valid government proof.
                </p>
              )}
              {profile.approvalStatus === "rejected" && (
                <p className="text-red-600 mb-3">
                  Your verification was rejected. Please upload a new valid document.
                </p>
              )}

              <div className="flex items-center gap-4">
                <input
                  id="documentUpload"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleDocumentChange}
                  className="border rounded px-3 py-2"
                />
                 {/* Show selected files */}
                {documentFile && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">Selected files:</p>
                    {/* <ul className="text-xs text-gray-500">
                      {documentFiles.map((file, idx) => (
                        <li key={idx}>{file.name}</li>
                      ))}
                    </ul> */}
                    <p className="text-xs text-gray-500">{documentFile.name}</p>
                  </div>
                )}
                <button
                  onClick={handleDocumentUpload}
                  disabled={uploading}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <FaSpinner className="animate-spin" /> Uploading...
                    </>
                  ) : (
                    <>
                      <FaUpload /> Upload
                    </>
                  )}
                </button>
              </div>

              {/* Already uploaded docs */}
              {profile.documents.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700">
                    Uploaded Documents:
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 text-sm">
                    {profile.documents.map((doc, idx) => (
                      <li key={idx}>
                        <a
                          href={doc}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 underline"
                        >
                          {doc.split("/").pop()}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </OwnerLayout>
  );
};

export default OwnerProfile;