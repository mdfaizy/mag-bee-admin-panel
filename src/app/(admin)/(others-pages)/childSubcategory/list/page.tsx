// "use client";

// import React from "react";



"use client";

import React, {
  useEffect,
  useState,
} from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";


import { getAllSubCategories } from "@/services/subCategoryService/subCategoryService";

const ChildSubCategoryTable = () => {
  const [subCategories, setSubCategories] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res =
          await getAllSubCategories();

        setSubCategories(
          res.subCategories || []
        );
      } catch (error) {
        console.error(
          "Failed to fetch child subcategories",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const childSubCategories =
    subCategories.filter(
      (item) => item.parentId
    );

  const getParentName = (
    parentId: number
  ) => {
    return (
      subCategories.find(
        (sub) => sub.id === parentId
      )?.name || "—"
    );
  };

  const formatDate = (
    dateString: string
  ) => {
    return new Date(
      dateString
    ).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading Child SubCategories...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mt-8 border">
      <h2 className="text-xl font-bold mb-4">
        Child SubCategories
      </h2>

      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Parent</TableCell>
              <TableCell>Created</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {childSubCategories.length ===
            0 ? (
              <TableRow>
                <TableCell className="text-center py-6">
                  No Child SubCategories
                </TableCell>
              </TableRow>
            ) : (
              childSubCategories.map(
                (item) => (
                  <TableRow
                    key={item.id}
                  >
                    <TableCell>
                      {item.id}
                    </TableCell>
                    <TableCell>
                      {item.name}
                    </TableCell>
                    <TableCell>
                      {item.slug}
                    </TableCell>
                    <TableCell>
                      {getParentName(
                        item.parentId
                      )}
                    </TableCell>
                    <TableCell>
                      {formatDate(
                        item.createdAt
                      )}
                    </TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ChildSubCategoryTable;