
"use client";

import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeadCell,
  TableCell,
} from "../ui/table";
import Pagination from "./Pagination";
// import { fetchProductAll } from "../../services/product/productService";
// import { useDispatch } from "react-redux";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";

import { useProductTableLogic } from "../../hooks/useEditProduct";


export default function ProductTable() {


const {
    currentPage,
    setCurrentPage,
    visibleData,
    totalPages,
    formData,
    handleChange,
    handleReset,
    isEditModalOpen,
    setIsEditModalOpen,
    editData,
    handleEdit,
    handleEditChange,
    handleImageChange,
    handleSaveEdit,
    uploading,
  } = useProductTableLogic();

  
  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] shadow-sm">
        <div className="w-full overflow-x-auto">
          <Table className="divide-y divide-gray-200 dark:divide-white/[0.05] text-sm">
            <TableHead className="bg-gray-100 dark:bg-white/[0.05]">
              <TableRow>
                <TableHeadCell>ID</TableHeadCell>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>Description</TableHeadCell>
                <TableHeadCell>Original Price</TableHeadCell>
                <TableHeadCell>Offer (%)</TableHeadCell>
                <TableHeadCell>Final Price</TableHeadCell>
                <TableHeadCell>Category</TableHeadCell>
                <TableHeadCell>Url</TableHeadCell>

                <TableHeadCell>Image</TableHeadCell>
                <TableHeadCell>Actions</TableHeadCell>
              </TableRow>
            </TableHead>

            <TableBody className="divide-y divide-gray-200 dark:divide-white/[0.05]">
              {visibleData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>₹{item.originalPrice}</TableCell>
                  <TableCell>{item.offer}%</TableCell>
                  <TableCell>₹{item.price}</TableCell>
                  
                  <TableCell className="px-3 py-2">{item.category?.name || "—"}</TableCell>
                 <TableCell>
  {item?.slug
    ? item.slug
    : item?.name?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "")}
</TableCell>

                  <TableCell>
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt="Product"
                        className="w-16 h-auto object-cover rounded"
                      />
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end px-4 py-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        className="max-w-[600px] m-4"
      >
        <div className="p-6 bg-white dark:bg-gray-900 rounded-2xl">
          <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
          {editData && (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEdit();
              }}
            >
              <div>
                <Label>Name</Label>
                <Input name="name" type="text" value={editData.name} onChange={handleEditChange} />
              </div>

              <div>
                <Label>Description</Label>
               
                <Input
                    type="text"
                    name="description"
                  value={editData.description}
                  onChange={handleEditChange}
               
                  />
              </div>

              <div>
                <Label>Original Price</Label>
                <Input

                  name="originalPrice"
                  type="number"
                   step={0.01}
                  value={editData.originalPrice}
                  onChange={handleEditChange}
                />
              </div>

              <div>
                <Label>Offer (%)</Label>
                <Input
                  name="offer"
                  type="number"
                   step={0.01}
                  value={editData.offer}
                  onChange={handleEditChange}
                />
              </div>

              <div>
                <Label>Upload Image</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                  className="mt-1 block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"
                />
                {uploading && <p className="text-sm text-blue-600 mt-1">Uploading image...</p>}
              </div>

              {editData.imageUrl && (
                <img
                  src={editData.imageUrl}
                  alt="Preview"
                  className="w-24 h-auto mt-2 rounded"
                />
              )}

              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  Save
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </>
  );
}









