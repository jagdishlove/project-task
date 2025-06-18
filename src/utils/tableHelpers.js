// Table configuration helpers
export const createActionsColumn = (handlers) => ({
  id: "actions",
  header: "Actions",
  cell: ({ row }) => {
    const rowIndex = row.index;
    const { editingRowIndex, onSave, onCancel, onEdit, onDelete } = handlers;

    const isEditing = editingRowIndex === rowIndex;

    return {
      isEditing,
      onSave: () => onSave(rowIndex),
      onCancel,
      onEdit: () => onEdit(rowIndex),
      onDelete: (event) => {
        event.currentTarget.blur();
        onDelete(rowIndex);
      },
    };
  },
});

export const createDataColumns = (headers, handlers) => {
  return headers.map((header) => ({
    accessorKey: header,
    header: header,
    cell: ({ row }) => {
      const rowIndex = row.index;
      const { editingRowIndex, editableData, localEditRowData, onCellChange } =
        handlers;

      if (editingRowIndex === rowIndex) {
        const value = localEditRowData[header] || "";
        return {
          isEditing: true,
          value,
          onChange: (e) => onCellChange(header, e.target.value),
        };
      }

      return {
        isEditing: false,
        value: editableData[rowIndex]?.[header] ?? "",
      };
    },
  }));
};

// Table pagination helpers
export const getTablePaginationProps = (
  table,
  pagination,
  editingRowIndex,
  setPagination
) => ({
  component: "div",
  count: table.getFilteredRowModel().rows.length,
  page: editingRowIndex !== null ? 0 : pagination.pageIndex,
  rowsPerPage: pagination.pageSize,
  onPageChange: (event, newPage) => {
    if (editingRowIndex === null) {
      setPagination((old) => ({ ...old, pageIndex: newPage }));
    }
  },
  onRowsPerPageChange: (event) => {
    if (editingRowIndex === null) {
      setPagination({
        pageIndex: 0,
        pageSize: Number(event.target.value),
      });
    }
  },
  rowsPerPageOptions: [5, 10, 20, 50],
  labelRowsPerPage: "Rows per page:",
});
