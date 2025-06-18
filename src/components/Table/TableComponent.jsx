import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  Paper,
  TablePagination,
  Box,
} from "@mui/material";

// Custom components
import EditableCell from "./EditableCell";
import TableActions from "./TableActions";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import TableSearch from "./TableSearch";

// Custom hooks
import { useTableData } from "../../hooks/useTableData";
import { useTableState } from "../../hooks/useTableState";

// Utilities
import { getTablePaginationProps } from "../../utils/tableHelpers";

const TableComponent = ({ headers, rows }) => {
  const {
    editableData,
    editingRowIndex,
    localEditRowData,
    startEditing,
    saveEdit,
    cancelEdit,
    deleteRow,
    updateCellValue,
  } = useTableData(rows);

  const {
    sorting,
    setSorting,
    globalFilter,
    setGlobalFilter,
    pagination,
    setPagination,
    deleteDialogOpen,
    rowToDeleteIndex,
    openDeleteDialog,
    closeDeleteDialog,
  } = useTableState();

  const columns = useMemo(
    () => [
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const rowIndex = row.index;
          const isEditing = editingRowIndex === rowIndex;

          return (
            <TableActions
              isEditing={isEditing}
              onSave={() => saveEdit(rowIndex)}
              onCancel={cancelEdit}
              onEdit={() => startEditing(rowIndex)}
              onDelete={(event) => {
                event?.currentTarget?.blur();
                openDeleteDialog(rowIndex);
              }}
            />
          );
        },
      },
      ...headers.map((header) => ({
        accessorKey: header,
        header: header,
        cell: ({ row }) => {
          const rowIndex = row.index;

          if (editingRowIndex === rowIndex) {
            const value = localEditRowData[header] || "";
            return (
              <EditableCell
                value={value}
                onChange={(e) => updateCellValue(header, e.target.value)}
              />
            );
          }

          return editableData[rowIndex]?.[header] ?? "";
        },
      })),
    ],
    [
      headers,
      editableData,
      editingRowIndex,
      localEditRowData,
      saveEdit,
      cancelEdit,
      startEditing,
      openDeleteDialog,
      updateCellValue,
    ]
  );

  const table = useReactTable({
    data: editableData,
    columns,
    state: { sorting, globalFilter, pagination },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleDeleteConfirm = () => {
    if (rowToDeleteIndex !== null) {
      deleteRow(rowToDeleteIndex);
    }
    closeDeleteDialog();
  };

  const paginationProps = getTablePaginationProps(
    table,
    pagination,
    editingRowIndex,
    setPagination
  );

  return (
    <Box>
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteConfirm}
      />

      <Paper
        elevation={3}
        sx={{
          position: "relative",
          height: 500,
          display: "flex",
          flexDirection: "column",
          paddingTop: "64px",
          paddingBottom: "72px",
        }}
      >
        <TableSearch
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          disabled={editingRowIndex !== null}
        />

        <Box sx={{ flex: 1, overflowX: "auto", overflowY: "auto" }}>
          <Table stickyHeader aria-label="table with sticky header">
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const sortDirection = header.column.getIsSorted();
                    return (
                      <TableCell
                        key={header.id}
                        sortDirection={sortDirection || false}
                        sx={{ backgroundColor: "background.paper" }}
                      >
                        {canSort ? (
                          <TableSortLabel
                            active={!!sortDirection}
                            direction={sortDirection === "asc" ? "asc" : "desc"}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </TableSortLabel>
                        ) : (
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableHead>

            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={headers.length + 1} align="center">
                    No results found.
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Box>

        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            borderTop: "1px solid #ddd",
            backgroundColor: "background.paper",
            padding: "8px 16px",
            zIndex: 10,
          }}
        >
          <TablePagination {...paginationProps} />
        </Box>
      </Paper>
    </Box>
  );
};

export default TableComponent;
