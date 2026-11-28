// import React, { useState } from "react";
// import Label from "../form/Label";
// import Input from "../form/input/InputField";

// const EditUserModal = ({ isOpen, onClose, user, onSave }: any) => {
//   const [formData, setFormData] = useState({ ...user });

//   const handleChange = (e: any) => {
//     setFormData((prev: any) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = () => {
//     onSave(formData);
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded shadow-lg w-[400px]">
//         <h2 className="text-lg font-semibold mb-4">Edit User</h2>
        
//          <Label>Name</Label>
//             <Input name="name" value={formData.name} onChange={handleChange}  
//              placeholder="Name"
//             className="w-full p-2 border mb-2" />

//              <Label>User Name</Label>
//             <Input name="userName" value={formData.userName} onChange={handleChange}  
//              placeholder="User name"
//             className="w-full p-2 border mb-2" />
//             <Label>Email</Label>
//             <Input name="email" value={formData.email} onChange={handleChange}  
//              placeholder="Email"
//             className="w-full p-2 border mb-2" />
//        <Label>Role</Label>
//             <Input name="role" value={formData.role} onChange={handleChange}  
//              placeholder="Role"
//             className="w-full p-2 border mb-2" />

//         <div className="flex justify-end gap-2 mt-4">
//           <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
//             Cancel
//           </button>
//           <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditUserModal;


"use client";

import React, { useEffect, useState } from "react";
import { X, Save, UserCog } from "lucide-react";
import Label from "../form/Label";
import Input from "../form/input/InputField";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSave: (data: any) => void;
}

const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-500 dark:focus:ring-brand-500/20 sm:text-sm";

const labelCls =
  "mb-1.5 block text-xs font-medium text-slate-700 dark:text-slate-300";

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [formData, setFormData] = useState<any>({
    name: "",
    userName: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    if (isOpen && user) {
      setFormData({ ...user });
    }
  }, [user, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/45 backdrop-blur-[1px] transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-user-drawer-title"
    >
      <aside
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-lg flex-col border-l border-slate-200 bg-slate-50/70 text-slate-900 shadow-2xl animate-in slide-in-from-right duration-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
      >
        {/* DRAWER HEADER */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
              <UserCog className="h-4 w-4" />
            </div>
            <div>
              <h2
                id="edit-user-drawer-title"
                className="text-base font-semibold text-slate-900 dark:text-slate-100"
              >
                Edit User
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user.email || `User #${user.id ?? ""}`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* FORM + SCROLLABLE BODY */}
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
            <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 sm:p-5">
              <h3 className="border-b border-slate-200/80 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:border-slate-800 dark:text-slate-200">
                Account Information
              </h3>

              <div>
                <Label className={labelCls}>Name</Label>
                <Input
                  name="name"
                  value={formData.name || ""}
                  onChange={handleChange}
                  placeholder="Full name"
                  className={inputCls}
                />
              </div>

              <div>
                <Label className={labelCls}>User Name</Label>
                <Input
                  name="userName"
                  value={formData.userName || ""}
                  onChange={handleChange}
                  placeholder="Username"
                  className={inputCls}
                />
              </div>

              <div>
                <Label className={labelCls}>Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className={inputCls}
                />
              </div>

              <div>
                <Label className={labelCls}>Role</Label>
                <Input
                  name="role"
                  value={formData.role || ""}
                  onChange={handleChange}
                  placeholder="e.g. ADMIN, STAFF"
                  className={inputCls}
                />
              </div>
            </section>
          </div>

          {/* DRAWER FOOTER */}
          <div className="flex shrink-0 items-center justify-end gap-2.5 border-t border-slate-200 bg-white px-6 py-3.5 dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-slate-800 dark:bg-brand-500 dark:hover:bg-brand-600 sm:text-sm"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
};

export default EditUserModal;