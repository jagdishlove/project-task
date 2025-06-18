import React, { memo, useRef } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import TablePagination from "@mui/material/TablePagination";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const EditableCell = memo(({ value, onChange, cellKey }) => {
  const inputRef = useRef(null);

  return (
    <TextField
      key={cellKey} // Added key prop to prevent re-creation
      inputRef={inputRef}
      variant="standard"
      value={value || ""} // Ensure value is never undefined
      onChange={onChange}
      sx={{ minWidth: 100 }}
      autoFocus={false} // Prevent auto-focus issues
    />
  );
});

const TableComponent = ({ headers, rows }) => {
  const [sorting, setSorting] = React.useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [editableData, setEditableData] = React.useState([]);
  const [editingRowIndex, setEditingRowIndex] = React.useState(null);
  const [localEditRowData, setLocalEditRowData] = React.useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [rowToDeleteIndex, setRowToDeleteIndex] = React.useState(null);

  React.useEffect(() => {
    setEditableData(rows);
  }, [rows]);

  const columns = React.useMemo(
    () => [
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const rowIndex = row.index;
          const isEditing = editingRowIndex === rowIndex;

          return isEditing ? (
            <Box display={"flex"}>
              <Button
                variant="contained"
                size="small"
                color="success"
                onClick={() => {
                  // On Save: merge localEditRowData into editableData
                  setEditableData((old) => {
                    const updated = [...old];
                    updated[rowIndex] = { ...localEditRowData };
                    return updated;
                  });
                  setEditingRowIndex(null);
                  setLocalEditRowData({});
                }}
                sx={{ mr: 1 }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={() => {
                  setLocalEditRowData({}); // discard changes
                  setEditingRowIndex(null);
                }}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <Box display="flex" gap={1}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setEditingRowIndex(rowIndex);
                  // Initialize with current row data as a proper object
                  setLocalEditRowData({ ...editableData[rowIndex] });
                }}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                size="small"
                color="error"
                onClick={(event) => {
                  event.currentTarget.blur();
                  setRowToDeleteIndex(rowIndex);
                  setDeleteDialogOpen(true);
                }}
              >
                Delete
              </Button>
            </Box>
          );
        },
      },
      ...headers.map((header) => ({
        accessorKey: header,
        header: header,
        cell: ({ row }) => {
          const rowIndex = row.index;

          if (editingRowIndex === rowIndex) {
            // Editing this row: use localEditRowData for input values
            const value = localEditRowData[header] || "";

            return (
              <EditableCell
                key={`${rowIndex}-${header}`} // Unique key for each cell
                cellKey={`${rowIndex}-${header}`} // Pass key to component
                value={value}
                onChange={(e) => {
                  const val = e.target.value;
                  setLocalEditRowData((prevData) => ({
                    ...prevData,
                    [header]: val,
                  }));
                }}
              />
            );
          }

          // Not editing: show static value from editableData
          return editableData[rowIndex]?.[header] ?? "";
        },
      })),
    ],
    [headers, editableData, editingRowIndex, localEditRowData]
  );

  const table = useReactTable({
    data: editableData,
    columns,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Box>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this row? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            No
          </Button>
          <Button
            onClick={() => {
              const updated = editableData.filter(
                (_, idx) => idx !== rowToDeleteIndex
              );
              setEditableData(updated);
              setEditingRowIndex(null);
              setDeleteDialogOpen(false);
            }}
            color="error"
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>

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
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            textAlign: "left",
            padding: "8px 16px",
            backgroundColor: "background.paper",
            borderBottom: "1px solid #ddd",
            zIndex: 10,
          }}
        >
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            sx={{ width: "40%" }}
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            overflowX: "auto",
            overflowY: "auto",
          }}
        >
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
          <TablePagination
            component="div"
            count={table.getFilteredRowModel().rows.length}
            page={editingRowIndex !== null ? 0 : pagination.pageIndex}
            rowsPerPage={pagination.pageSize}
            onPageChange={(event, newPage) => {
              if (editingRowIndex === null) {
                setPagination((old) => ({ ...old, pageIndex: newPage }));
              }
            }}
            onRowsPerPageChange={(event) => {
              if (editingRowIndex === null) {
                setPagination({
                  pageIndex: 0,
                  pageSize: Number(event.target.value),
                });
              }
            }}
            rowsPerPageOptions={[5, 10, 20, 50]}
            labelRowsPerPage="Rows per page:"
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default TableComponent;
