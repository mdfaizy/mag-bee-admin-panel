// import React, { ReactNode } from "react";

// // Props for Table
// interface TableProps {
//   children: ReactNode; // Table content (thead, tbody, etc.)
//   className?: string; // Optional className for styling
// }

// // Props for TableHeader
// interface TableHeaderProps {
//   children: ReactNode; // Header row(s)
//   className?: string; // Optional className for styling
// }

// // Props for TableBody
// interface TableBodyProps {
//   children: ReactNode; // Body row(s)
//   className?: string; // Optional className for styling
// }

// // Props for TableRow
// interface TableRowProps {
//   children: ReactNode; // Cells (th or td)
//   className?: string; // Optional className for styling
// }

// // Props for TableCell
// interface TableCellProps {
//   children: ReactNode; // Cell content
//   isHeader?: boolean; // If true, renders as <th>, otherwise <td>
//   className?: string; // Optional className for styling
// }

// // Table Component
// const Table: React.FC<TableProps> = ({ children, className }) => {
//   return <table className={`min-w-full  ${className}`}>{children}</table>;
// };

// // TableHeader Component


// // TableBody Component
// const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
//   return <tbody className={className}>{children}</tbody>;
// };

// // TableRow Component
// const TableRow: React.FC<TableRowProps> = ({ children, className }) => {
//   return <tr className={className}>{children}</tr>;
// };
// const TableHead: React.FC<TableHeaderProps> = ({ children, className }) => {
//   return <thead className={className}>{children}</thead>;
// };

// // ✅ TableHeadCell for individual <th>
// const TableHeadCell: React.FC<TableCellProps> = ({ children, className }) => {
//   return <th className={` ${className}`}>{children}</th>;
// };
// // TableCell Component
// const TableCell: React.FC<TableCellProps> = ({
//   children,
//   isHeader = false,
//   className,
// }) => {
//   const CellTag = isHeader ? "th" : "td";
//   return <CellTag className={` ${className}`}>{children}</CellTag>;
// };

// export { Table, TableHead, TableBody, TableRow, TableCell, TableHeadCell };



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
