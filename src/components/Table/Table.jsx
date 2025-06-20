import React, { useMemo, useState } from "react";
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
  Button,
  TextField,
} from "@mui/material";

function CSVTable({ columns, rows }) {
  const [editingRowId, setEditingRowId] = useState(null);
  const [tableData, setTableData] = useState(rows);

  const handleCellChange = (rowIndex, columnId, value) => {
    setTableData((oldData) =>
      oldData.map((row, index) =>
        index === rowIndex ? { ...row, [columnId]: value } : row
      )
    );
  };
  const editableColumns = useMemo(() => {
    return columns.map((col) => ({
      ...col,
      cell: ({ row, getValue }) =>
        row.id === editingRowId ? (
          <TextField
            variant="standard"
            size="small"
            value={getValue() || ""}
            onChange={(e) =>
              handleCellChange(row.index, col.accessorKey, e.target.value)
            }
          />
        ) : (
          getValue()
        ),
    }));
  }, [columns, editingRowId]);

  const actionsColumn = {
    id: "actions",
    header: "Actions",
    cell: ({ row }) =>
      row.id === editingRowId ? (
        <>
          <Button onClick={() => setEditingRowId(null)}>Save</Button>
          <Button onClick={() => setEditingRowId(null)} color="error">
            Cancel
          </Button>
        </>
      ) : (
        <Button onClick={() => setEditingRowId(row.id)}>Edit</Button>
      ),
  };

  const finalColumns = [...editableColumns, actionsColumn];
  const table = useReactTable({
    data: tableData,
    columns: finalColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableCell key={header.id}>
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
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CSVTable;
