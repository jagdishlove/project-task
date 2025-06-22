import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
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
  TablePagination,
  Box,
  TableSortLabel,
} from "@mui/material";
import { useMemo, useRef, useState } from "react";
import EditableCell from "./EditableCell";
import { getTablePaginationProps } from "../../utils/tableHelpers";
import { useTableState } from "../../hooks/useTableState";
import ExportCSVButton from "./ExportCSV";

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

  const { sorting, globalFilter, pagination, setPagination } = useTableState();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    state: { sorting, globalFilter, pagination },
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

  const paginationProps = getTablePaginationProps(
    table,
    pagination,
    editingRowIndex,
    setPagination
  );

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
    <Box>
      {/* <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteConfirm}
      /> */}
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
        {/* <TableSearch
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          disabled={editingRowIndex !== null}
        /> */}
        <Box sx={{ padding: "1rem", display: "flex", gap: 2 }}>
          {/* <Button
            variant="contained"
            onClick={addNewRow}
            disabled={editingRowIndex !== null}
          >
            Add Row
          </Button> */}

          {/* <Button
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
          </Button> */}
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
        <ExportCSVButton data={data} />
      </Box>
    </Box>
  );
};

export default TableComp;
