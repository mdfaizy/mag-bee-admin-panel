"use client";
import React, { useState } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";

export default function UserAddressCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [address, setAddress] = useState({
    country: "",
    cityState: "",
    postalCode: "",
    taxId: "",
  });

  const isAddressEmpty = !address.country && !address.cityState && !address.postalCode && !address.taxId;

  const [editData, setEditData] = useState(address);

  const handleOpenModal = () => {
    setEditData(address); // Prefill form if any
    openModal();
  };

  const handleSave = () => {
    setAddress(editData); // Save form data
    closeModal();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Address
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Country</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {address.country || "—"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">City/State</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {address.cityState || "—"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Postal Code</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {address.postalCode || "—"}
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">TAX ID</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {address.taxId || "—"}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleOpenModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            {isAddressEmpty ? "➕ Add Address" : "✏️ Edit"}
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full p-4 bg-white dark:bg-gray-900 rounded-3xl lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {isAddressEmpty ? "Add Address" : "Edit Address"}
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              {isAddressEmpty
                ? "Please provide your address details."
                : "Update your address details below."}
            </p>
          </div>
          <form className="flex flex-col">
            <div className="px-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label>Country</Label>
                  <Input name="country" value={editData.country} onChange={handleChange} />
                </div>
                <div>
                  <Label>City/State</Label>
                  <Input name="cityState" value={editData.cityState} onChange={handleChange} />
                </div>
                <div>
                  <Label>Postal Code</Label>
                  <Input name="postalCode" value={editData.postalCode} onChange={handleChange} />
                </div>
                <div>
                  <Label>TAX ID</Label>
                  <Input name="taxId" value={editData.taxId} onChange={handleChange} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save Address
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
