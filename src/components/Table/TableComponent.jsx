import React, { useMemo, useState } from "react";
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
  Checkbox,
  Button,
  Typography,
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
import ExportCSVButton from "./ExportCSV";

const TableComponent = ({ headers, rows }) => {
  const [data, setData] = useState(rows);

  console.log("datadatadata", data);
  const {
    editableData,
    editingRowIndex,
    startEditing,
    saveEdit,
    cancelEdit,
    deleteRow,
    deleteMultipleRows,
    addNewRow,
  } = useTableData(rows, headers);

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
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
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
        cell: ({ row, getValue, column, table }) => {
          const rowIndex = row.index;

          if (editingRowIndex === rowIndex) {
            const value = getValue() || "";

            return (
              <EditableCell
                value={value}
                row={row}
                column={column}
                table={table}
              />
            );
          }

          return data[rowIndex]?.[header] ?? "";
        },
      })),
    ],
    [
      headers,
      editingRowIndex,
      cancelEdit,
      saveEdit,
      startEditing,
      openDeleteDialog,
      data,
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
    enableRowSelection: true,
    meta: {
      updateData: (rowIndex, columnId, value) => {
        console.log("rowIndexrowIndexrowIndex", rowIndex, columnId, value);
        setData((prev) =>
          prev.map((row, index) =>
            index === rowIndex ? { ...row, [columnId]: value } : row
          )
        );
      },
    },
  });

  // ✅ Must come after table initialization
  const selectedRowIndices = table
    .getSelectedRowModel()
    .rows.map((r) => r.index);

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
      <Typography
        variant="h5"
        component="h2"
        sx={{ padding: "16px", fontWeight: "bold" }}
      >
        Data Table
      </Typography>
      <Paper
        elevation={3}
        sx={{
          position: "relative",
          height: 500,
          display: "flex",
          flexDirection: "column",
          paddingTop: "64px",
          paddingBottom: "72px",
          width: { xs: "100%", sm: "100%" },
        }}
      >
        <TableSearch
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          disabled={editingRowIndex !== null}
        />
        <Box sx={{ padding: "1rem", display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            onClick={addNewRow}
            disabled={editingRowIndex !== null}
          >
            Add Row
          </Button>

          <Button
            variant="outlined"
            color="error"
            disabled={!selectedRowIndices.length > 0}
            // sx={{ width: "30%", margin: 0 }}
            onClick={() => {
              deleteMultipleRows(selectedRowIndices);
              table.resetRowSelection(); // clear selection
            }}
          >
            Delete Selected ({selectedRowIndices.length})
          </Button>
        </Box>

        <Box sx={{ flex: 1, overflowX: "auto", overflowY: "auto" }}>
          <Table stickyHeader aria-label="editable table with selection">
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
                        sx={{
                          backgroundColor: "background.paper",
                          fontSize: "1rem",
                          fontWeight: "700",
                          textAlign: "center",

                          width: header.getSize(),
                        }}
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
                  <TableCell
                    colSpan={headers.length + 2}
                    align="center"
                    sx={{ py: 4 }}
                  >
                    <Typography
                      sx={{ width: { xs: "7%", sm: "30%" } }}
                      variant="subtitle1"
                      color="textSecondary"
                    >
                      No results found.
                    </Typography>
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
          <TablePagination
            {...paginationProps}
            siblingcount={1}
            boundarycount={1}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </Box>
      </Paper>

      <Box
        sx={{
          top: 0,
          right: 0,
          left: 16,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          height: "64px",
        }}
      >
        <ExportCSVButton data={editableData} />
      </Box>
    </Box>
  );
};

export default TableComponent;
