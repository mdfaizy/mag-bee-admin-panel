// import React, { ReactNode } from "react";

// // Table wrapper
// interface TableProps {
//   children: ReactNode;
//   className?: string;
  
// }
// const Table: React.FC<TableProps> = ({ children, className }) => (
//   <table className={`min-w-full ${className}`}>{children}</table>
// );

// // Table Head <thead>
// interface TableHeaderProps {
//   children: ReactNode;
//   className?: string;
// }
// const TableHead: React.FC<TableHeaderProps> = ({ children, className }) => (
//   <thead className={className}>{children}</thead>
// );

// // Table Body <tbody>
// interface TableBodyProps {
//   children: ReactNode;
//   className?: string;
// }
// const TableBody: React.FC<TableBodyProps> = ({ children, className }) => (
//   <tbody className={className}>{children}</tbody>
// );

// // Table Row <tr>
// interface TableRowProps {
//   children: ReactNode;
//   className?: string;
// }
// const TableRow: React.FC<TableRowProps> = ({ children, className }) => (
//   <tr className={className}>{children}</tr>
// );

// // Table Head Cell <th>
// interface TableCellProps {
//   children: ReactNode;
//   className?: string;
//   onClick?: () => void;
// }
// const TableHeadCell: React.FC<TableCellProps> = ({ children, className ,onClick}) => (
//   <th className={`px-6 py-3 text-left font-medium text-gray-600 ${className}`}
//   onClick={onClick}
//   >
//     {children}
//   </th>
// );

// // Table Data Cell <td>
// const TableCell: React.FC<TableCellProps> = ({ children, className }) => (
//   <td className={`px-6 py-4 text-sm text-gray-700 ${className}`}>{children}</td>
// );

// export { Table, TableHead, TableBody, TableRow, TableHeadCell, TableCell };




    import React, { ReactNode } from "react";

    interface TableProps {
      children: ReactNode;
      className?: string;
    }

    interface TableHeaderProps {
      children: ReactNode;
      className?: string;
    }

    interface TableBodyProps {
      children: ReactNode;
      className?: string;
    }

    interface TableRowProps {
      children: ReactNode;
      className?: string;
    }

    interface TableCellProps {
      children: ReactNode;
      isHeader?: boolean;
      className?: string;
      colSpan?: number;   // 👈 add this (important)
    }

    /* ---------------- COMPONENTS ---------------- */

    // const Table: React.FC<TableProps> = ({ children, className }) => (
    //   <div className="overflow-x-auto">
    //     <table className={`min-w-full text-sm ${className}`}>{children}</table>
    //   </div>
    // );
    const Table: React.FC<TableProps> = ({ children, className }) => (
    <div className="w-full overflow-x-auto">
      <table className={`w-full min-w-full text-sm ${className}`}>
        {children}
      </table>
    </div>
  );


  const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => (
    <thead
      className={`bg-slate-50 text-slate-500 uppercase text-xs dark:bg-gray-800 dark:text-gray-300 ${className}`}
    >
      {children}
    </thead>
  );

    const TableBody: React.FC<TableBodyProps> = ({ children, className }) => (
      <tbody className={className}>{children}</tbody>
    );

    const TableRow: React.FC<TableRowProps> = ({ children, className }) => (
    <tr
      className={`border-t border-slate-200 hover:bg-slate-50 dark:border-gray-700 dark:hover:bg-gray-800 transition ${className}`}
    >
      {children}
    </tr>
  );


    const TableCell: React.FC<TableCellProps> = ({
    children,
    isHeader = false,
    className,
    colSpan,
  }) => {
    if (isHeader) {
      return (
        <th
          scope="col"
          colSpan={colSpan}
          className={`px-4 py-3 text-left font-semibold ${className}`}
        >
          {children}
        </th>
      );
    }

    return (
      <td colSpan={colSpan} className={`px-4 py-3 ${className}`}>
        {children}
      </td>
    );
  };


    /* ---------------- EXPORTS (MOST IMPORTANT) ---------------- */

    export { Table, TableHeader, TableBody, TableRow, TableCell };
