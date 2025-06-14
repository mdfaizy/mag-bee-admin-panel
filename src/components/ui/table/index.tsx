import React, { ReactNode } from "react";

// Table wrapper
interface TableProps {
  children: ReactNode;
  className?: string;
}
const Table: React.FC<TableProps> = ({ children, className }) => (
  <table className={`min-w-full ${className}`}>{children}</table>
);

// Table Head <thead>
interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}
const TableHead: React.FC<TableHeaderProps> = ({ children, className }) => (
  <thead className={className}>{children}</thead>
);

// Table Body <tbody>
interface TableBodyProps {
  children: ReactNode;
  className?: string;
}
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => (
  <tbody className={className}>{children}</tbody>
);

// Table Row <tr>
interface TableRowProps {
  children: ReactNode;
  className?: string;
}
const TableRow: React.FC<TableRowProps> = ({ children, className }) => (
  <tr className={className}>{children}</tr>
);

// Table Head Cell <th>
interface TableCellProps {
  children: ReactNode;
  className?: string;
}
const TableHeadCell: React.FC<TableCellProps> = ({ children, className }) => (
  <th className={`px-6 py-3 text-left font-medium text-gray-600 ${className}`}>
    {children}
  </th>
);

// Table Data Cell <td>
const TableCell: React.FC<TableCellProps> = ({ children, className }) => (
  <td className={`px-6 py-4 text-sm text-gray-700 ${className}`}>{children}</td>
);

export { Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell };
