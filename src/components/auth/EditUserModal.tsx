import React, { useState } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";

const EditUserModal = ({ isOpen, onClose, user, onSave }: any) => {
  const [formData, setFormData] = useState({ ...user });

  const handleChange = (e: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-[400px]">
        <h2 className="text-lg font-semibold mb-4">Edit User</h2>
        
         <Label>Name</Label>
            <Input name="name" value={formData.name} onChange={handleChange}  
             placeholder="Name"
            className="w-full p-2 border mb-2" />

             <Label>User Name</Label>
            <Input name="userName" value={formData.userName} onChange={handleChange}  
             placeholder="User name"
            className="w-full p-2 border mb-2" />
            <Label>Email</Label>
            <Input name="email" value={formData.email} onChange={handleChange}  
             placeholder="Email"
            className="w-full p-2 border mb-2" />
       <Label>Role</Label>
            <Input name="role" value={formData.role} onChange={handleChange}  
             placeholder="Role"
            className="w-full p-2 border mb-2" />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
