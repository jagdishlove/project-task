import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import SearchIcon from "@mui/icons-material/Search";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
  TextField,
  InputAdornment,
  Stack,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  IconButton,
  Checkbox,
} from "@mui/material";
import { useMemo, useRef, useState } from "react";
import EditableCell from "./EditableCell";
import { getTablePaginationProps } from "../../utils/tableHelpers";
import { useTableState } from "../../hooks/useTableState";
import ExportCSVButton from "./ExportCSV";
import DeleteConfirmDialog from "./DeleteConfirmDialog";

const TableComponent = ({ headers, rows }) => {
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editedRow, setEditedRow] = useState({});
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const safeHeaders = Array.isArray(headers) ? headers : [];
  const safeRows = Array.isArray(rows) ? rows : [];

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDeleteIndex, setRowToDeleteIndex] = useState(null);
  const [exportFilename, setExportFilename] = useState("table_data.csv");

  const handleDeleteConfirm = () => {
    setData((prev) => prev.filter((_, idx) => idx !== rowToDeleteIndex));
    setDeleteDialogOpen(false);
    setRowToDeleteIndex(null);
  };

  const [data, setData] = useState(rows);
  const editBufferRef = useRef({});
  const theme = useTheme();
  const [rowSelection, setRowSelection] = useState({});

  const columns = useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            indeterminate={
              table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()
            }
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
            inputProps={{
              "aria-label": "select all rows",
            }}
            size="small"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={editingRowIndex !== null} // disable selection while editing
            onChange={row.getToggleSelectedHandler()}
            inputProps={{
              "aria-label": `select row ${row.index}`,
            }}
            size="small"
          />
        ),
        enableSorting: false,
        size: 40,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row, table }) => {
          const rowIndex = row.index;
          const isEditing = editingRowIndex === rowIndex;

          return isEditing ? (
            <Stack direction="row" spacing={1}>
              <Tooltip title="Save">
                <IconButton
                  sx={{
                    outline: "none",
                    "&:focus": { outline: "none" },
                    "&:active": { boxShadow: "none" },
                  }}
                  color="primary"
                  onClick={() => {
                    const changes = editBufferRef.current[rowIndex] || {};
                    Object.entries(changes).forEach(([columnId, value]) => {
                      table.options.meta?.updateData?.(
                        rowIndex,
                        columnId,
                        value
                      );
                    });
                    setEditingRowIndex(null);
                    setEditedRow({});
                    delete editBufferRef.current[rowIndex];
                  }}
                >
                  <SaveIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Cancel">
                <IconButton
                  sx={{
                    outline: "none",
                    "&:focus": { outline: "none" },
                    "&:active": { boxShadow: "none" },
                  }}
                  color="secondary"
                  onClick={() => {
                    if (
                      rowIndex === data.length - 1 && // if it's the last row (the newly added one)
                      Object.values(row.original).every((v) => v === "") // and empty row
                    ) {
                      // Remove the newly added empty row from data
                      setData((prev) => prev.slice(0, -1));
                    }
                    // Reset editing state
                    setEditingRowIndex(null);
                    setEditedRow({});
                    delete editBufferRef.current[rowIndex];
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          ) : (
            <Stack direction="row" spacing={1}>
              <Tooltip title="Edit">
                <IconButton
                  sx={{
                    outline: "none",
                    "&:focus": { outline: "none" },
                    "&:active": { boxShadow: "none" },
                  }}
                  color="primary"
                  onClick={() => {
                    setEditingRowIndex(rowIndex);
                    setEditedRow({ ...row.original });
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  sx={{
                    outline: "none",
                    "&:focus": { outline: "none" },
                    "&:active": { boxShadow: "none" },
                  }}
                  color="error"
                  onClick={() => {
                    setRowToDeleteIndex(rowIndex);
                    setDeleteDialogOpen(true);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Stack>
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
          const isEmpty = value === undefined || value === null || value === "";

          return editingRowIndex === rowIndex ? (
            <EditableCell
              value={value}
              columnId={columnId}
              rowIndex={rowIndex}
              valueRef={editBufferRef}
            />
          ) : (
            <Box
              sx={{
                textAlign: "left",
                color: isEmpty ? "text.disabled" : "inherit",
                fontStyle: isEmpty ? "italic" : "normal",
                letterSpacing: isEmpty ? 1 : 0,
                width: "100%",
              }}
            >
              {isEmpty ? "———" : value}
            </Box>
          );
        },
        enableSorting: true,
      })),
    ],
    [safeHeaders, editingRowIndex]
  );

  const {
    sorting,
    globalFilter,
    pagination,
    setPagination,
    setGlobalFilter,
    setSorting,
  } = useTableState();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { sorting, globalFilter, pagination, rowSelection },
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    columnResizeMode: "onChange",
    enableRowSelection: true,
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
    <Box sx={{ px: 2, pb: 2 }}>
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      <Dialog
        open={exportDialogOpen}
        onClose={() => setExportDialogOpen(false)}
        fullwidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            pb: 0,
            fontSize: "1.2rem",
          }}
        >
          Export CSV File
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Filename"
            fullwidth
            value={exportFilename}
            onChange={(e) => setExportFilename(e.target.value)}
            placeholder="Enter filename (e.g. report)"
            InputProps={{
              endAdornment: (
                <Typography variant="caption" sx={{ ml: 1 }}>
                  .csv
                </Typography>
              ),
            }}
          />
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 2 }}>
          <Button onClick={() => setExportDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <ExportCSVButton
            data={data}
            filename={
              exportFilename.endsWith(".csv")
                ? exportFilename
                : `${exportFilename || "table_data"}.csv`
            }
            onClick={() => setExportDialogOpen(false)}
          />
        </DialogActions>
      </Dialog>

      <Paper elevation={3} sx={{ borderRadius: 3, overflow: "hidden" }}>
        <Typography
          fullwidth
          bgcolor={"lightgray"}
          p={2}
          variant="h6"
          fontWeight="bold"
        >
          Data Table
        </Typography>
        <Box
          sx={{
            px: 2,
            py: 2,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <TextField
            placeholder="Search..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            size="small"
            width={80}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Stack direction="row" spacing={2} width={{ xs: "100%", sm: "auto" }}>
            <Button
              fullwidth
              variant="outlined"
              color="error"
              disabled={
                editingRowIndex !== null ||
                Object.keys(rowSelection).length === 0
              }
              onClick={() => {
                const selectedRowIndices = Object.keys(rowSelection).map((id) =>
                  Number(id)
                );
                setData((prev) =>
                  prev.filter((_, idx) => !selectedRowIndices.includes(idx))
                );
                setRowSelection({});
              }}
            >
              Delete Selected ({Object.keys(rowSelection).length})
            </Button>
            <Button
              fullwidth
              variant="contained"
              color="primary"
              onClick={() => setExportDialogOpen(true)}
              sx={{ ml: 2 }}
            >
              Export CSV
            </Button>
          </Stack>
        </Box>

        <TableContainer sx={{ maxHeight: 420 }}>
          <Table stickyHeader size="small">
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
                          backgroundColor: theme.palette.grey[100],
                          fontWeight: 600,
                          textAlign: "center",
                          fontSize: "0.95rem",
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
                    colSpan={headers.length + 1}
                    align="center"
                    sx={{ py: 4 }}
                  >
                    <Typography variant="subtitle1" color="textSecondary">
                      No results found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      "&:nth-of-type(even)": {
                        backgroundColor: theme.palette.grey[50],
                      },
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} sx={{ textAlign: "center" }}>
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
        </TableContainer>

        <Box
          sx={{
            px: 2,
            py: 1,
            borderTop: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "flex-end",
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
    </Box>
  );
};

export default TableComponent;
