import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { useMemo, useRef, useState } from "react";
import EditableCell from "./EditableCell";

const TableComp = ({ headers, rows }) => {
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  console.log("editedRow", editedRow);
  const safeHeaders = Array.isArray(headers) ? headers : [];
  const safeRows = Array.isArray(rows) ? rows : [];

  const [data, setData] = useState(rows);
  const editBufferRef = useRef({});

  // Define non-editable columns
  const columns = useMemo(
    () => [
      {
        id: "actions",
        header: "Actions",
        cell: ({ row, table }) => {
          const rowIndex = row.index;
          const isEditing = editingRowIndex === rowIndex;

          return isEditing ? (
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                const changes = editBufferRef.current[rowIndex] || {};

                Object.entries(changes).forEach(([columnId, value]) => {
                  table.options.meta?.updateData?.(rowIndex, columnId, value);
                });

                setEditingRowIndex(null);
                setEditedRow({});
                delete editBufferRef.current[rowIndex];
              }}
            >
              Save
            </Button>
          ) : (
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                setEditingRowIndex(rowIndex);
                setEditedRow({ ...row.original });
              }}
            >
              Edit
            </Button>
          );
        },
      },
      ...safeHeaders.map((col) => ({
        accessorKey: col.accessorKey,
        header: col.header,
        cell: ({ row, column }) => {
          const rowIndex = row.index;
          const columnId = column.id;
          const value = row.original[columnId];

          return editingRowIndex === rowIndex ? (
            <EditableCell
              value={value}
              columnId={columnId}
              rowIndex={rowIndex}
              valueRef={editBufferRef}
            />
          ) : (
            value
          );
        },
      })),
    ],
    [safeHeaders, editingRowIndex]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: "onChange",
    meta: {
      updateData: (rowIndex, columnId, value) =>
        setData((prev) =>
          prev.map((row, index) =>
            index === rowIndex
              ? {
                  ...prev[rowIndex],
                  [columnId]: value,
                }
              : row
          )
        ),
    },
  });

  if (!safeRows.length) {
    return (
      <Typography
        variant="body1"
        align="center"
        sx={{ mt: 4, color: "text.secondary" }}
      >
        No data to display.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
      <Table stickyHeader size="small" aria-label="csv data table">
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell
                  key={header.id}
                  sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} sx={{ whiteSpace: "nowrap" }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComp;
