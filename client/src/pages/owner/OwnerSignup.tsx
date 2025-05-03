import { useState } from "react";
import { useAuthStore } from "../../stores/authStore";

const OwnerSignup = () => {
    const { signup } = useAuthStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Add validation & API call
    console.log("Owner Signup Data:", formData);
    await signup(formData,"owner")
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-2xl mb-4 text-center font-bold">Owner Signup</h2>
        {["name", "email", "phone", "password", "confirmPassword"].map(
          (field) => (
            <input
              key={field}
              type={field.includes("password") ? "password" : "text"}
              name={field}
              placeholder={field.replace(/([A-Z])/g, " $1")}
              value={(formData as any)[field]}
              onChange={handleChange}
              className="w-full mb-3 px-3 py-2 border rounded"
            />
          )
        )}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default OwnerSignup;
