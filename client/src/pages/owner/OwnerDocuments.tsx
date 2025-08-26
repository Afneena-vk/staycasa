// import { useState } from "react";
// import { FaUpload, FaFile, FaTrash, FaEye } from "react-icons/fa";
// import OwnerLayout from "../../layouts/owner/OwnerLayout";
// import { useAuthStore } from "../../stores/authStore";

// const OwnerDocuments = () => {
//   const { userData } = useAuthStore();
//   const [uploadedFiles, setUploadedFiles] = useState(userData?.documents || []);

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (files) {
//       // Handle file upload logic here
//       console.log("Files to upload:", files);
//     }
//   };

//   return (
//     <OwnerLayout>
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
//             Document Management
//           </h1>
//           <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
//             userData?.approvalStatus === 'approved' 
//               ? 'bg-green-100 text-green-800' 
//               : userData?.approvalStatus === 'pending'
//               ? 'bg-yellow-100 text-yellow-800'
//               : 'bg-red-100 text-red-800'
//           }`}>
//             Status: {userData?.approvalStatus}
//           </div>
//         </div>

//         {/* Upload Section */}
//         <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
//           <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
//           <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
//             <FaUpload className="mx-auto text-4xl text-gray-400 mb-4" />
//             <p className="text-lg mb-2">Drag and drop files here or click to browse</p>
//             <p className="text-sm text-gray-500 mb-4">Supported formats: PDF, JPG, PNG (Max 5MB)</p>
//             <input
//               type="file"
//               multiple
//               accept=".pdf,.jpg,.jpeg,.png"
//               onChange={handleFileUpload}
//               className="hidden"
//               id="file-upload"
//             />
//             <label
//               htmlFor="file-upload"
//               className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition"
//             >
//               <FaUpload />
//               Choose Files
//             </label>
//           </div>
//         </div>

//         {/* Uploaded Documents */}
//         <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
//           <h2 className="text-xl font-semibold mb-4">Uploaded Documents</h2>
//           {uploadedFiles.length > 0 ? (
//             <div className="space-y-3">
//               {uploadedFiles.map((doc, index) => (
//                 <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <FaFile className="text-blue-600" />
//                     <div>
//                       <p className="font-medium">Document {index + 1}</p>
//                       <p className="text-sm text-gray-500">Uploaded</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded">
//                       <FaEye size={14} />
//                     </button>
//                     <button className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded">
//                       <FaTrash size={14} />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="text-center py-8">
//               <FaFile className="mx-auto text-4xl text-gray-400 mb-4" />
//               <p className="text-gray-500">No documents uploaded yet</p>
//             </div>
//           )}
//         </div>

//         {/* Required Documents Checklist */}
//         <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6">
//           <h2 className="text-xl font-semibold mb-4">Required Documents</h2>
//           <div className="space-y-3">
//             {[
//               "Business Registration Certificate",
//               "Tax Identification Number",
//               "Identity Proof (Passport/Driver's License)",
//               "Address Proof",
//               "Bank Account Details"
//             ].map((doc, index) => (
//               <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
//                 <input
//                   type="checkbox"
//                   checked={index < uploadedFiles.length}
//                   readOnly
//                   className="h-4 w-4"
//                 />
//                 <span className={index < uploadedFiles.length ? 'line-through text-gray-500' : ''}>
//                   {doc}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </OwnerLayout>
//   );
// };

// export default OwnerDocuments;