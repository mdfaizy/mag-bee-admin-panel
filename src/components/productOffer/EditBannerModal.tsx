"use client";

import React, { useEffect, useState, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { Modal } from "../ui/modal";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import Button from "../ui/button/Button";
import { toast } from "react-toastify";
import { updateOfferBanner } from "@/services/bannerServices/BannerService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const EditOfferBannerModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedBanner } = useSelector((state: RootState) => state.banner);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    link: "",
    startDate: "",
    endDate: "",
    imageUrl: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /* 🔥 SYNC DATA */
  useEffect(() => {
    if (!selectedBanner) return;

    setFormData({
      title: selectedBanner.title ?? "",
      subtitle: selectedBanner.subtitle ?? "",
      link: selectedBanner.link ?? "",
      startDate: selectedBanner.startDate?.split("T")[0] ?? "",
      endDate: selectedBanner.endDate?.split("T")[0] ?? "",
      imageUrl: selectedBanner.imageUrl ?? "",
    });

    setImagePreview(selectedBanner.imageUrl ?? null);
  }, [selectedBanner]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* SUBMIT */
  const handleSubmit = async () => {
    if (!selectedBanner) return;

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setLoading(true);

    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      fd.append(key, value)
    );

    dispatch(
      updateOfferBanner({
        id: selectedBanner.id,
        formData: fd,
        onSuccess: () => {
          setLoading(false);
          onClose();
        },
      })
    );
  };

  if (!selectedBanner) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px]">
      <div className="p-6 bg-white rounded-2xl space-y-4">
        <h2 className="text-xl font-semibold">Edit Offer Banner</h2>

        <Label>Title *</Label>
        <Input name="title" value={formData.title} onChange={handleChange} />

        <Label>Subtitle</Label>
        <TextArea name="subtitle" value={formData.subtitle} onChange={handleChange} />

        <Label>Redirect Link</Label>
        <Input name="link" value={formData.link} onChange={handleChange} />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Start Date</Label>
            <Input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
          </div>
          <div>
            <Label>End Date</Label>
            <Input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
          </div>
        </div>

        <div>
          {/* <Label>Banner Image *</Label> */}
          {/* <input type="file" accept="image/*" onChange={handleImageChange} /> */}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-48 mt-3 rounded border"
            />
          )}
        </div>


        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditOfferBannerModal;
