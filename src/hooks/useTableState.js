import { useState } from "react";

export const useTableState = () => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDeleteIndex, setRowToDeleteIndex] = useState(null);

  const openDeleteDialog = (rowIndex) => {
    setRowToDeleteIndex(rowIndex);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setRowToDeleteIndex(null);
  };

  return {
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
  };
};
