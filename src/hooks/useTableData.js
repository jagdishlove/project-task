import { useState, useEffect, useCallback } from "react";

export const useTableData = (initialRows) => {
  const [editableData, setEditableData] = useState([]);
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [localEditRowData, setLocalEditRowData] = useState({});

  useEffect(() => {
    setEditableData(initialRows);
  }, [initialRows]);

  const startEditing = useCallback(
    (rowIndex) => {
      setEditingRowIndex(rowIndex);
      setLocalEditRowData({ ...editableData[rowIndex] });
    },
    [editableData]
  );

  const saveEdit = useCallback(
    (rowIndex) => {
      setEditableData((old) => {
        const updated = [...old];
        updated[rowIndex] = { ...localEditRowData };
        return updated;
      });
      setEditingRowIndex(null);
      setLocalEditRowData({});
    },
    [localEditRowData]
  );

  const cancelEdit = useCallback(() => {
    setLocalEditRowData({});
    setEditingRowIndex(null);
  }, []);

  const deleteRow = useCallback((rowIndex) => {
    setEditableData((prev) => prev.filter((_, idx) => idx !== rowIndex));
    setEditingRowIndex(null);
  }, []);

  // ✅ New: Bulk delete handler
  const deleteMultipleRows = useCallback((indices) => {
    setEditableData((prev) => prev.filter((_, idx) => !indices.includes(idx)));
    setEditingRowIndex(null);
  }, []);

  const updateCellValue = useCallback((header, value) => {
    setLocalEditRowData((prevData) => ({
      ...prevData,
      [header]: value,
    }));
  }, []);

  return {
    editableData,
    editingRowIndex,
    localEditRowData,
    startEditing,
    saveEdit,
    cancelEdit,
    deleteRow,
    deleteMultipleRows,
    updateCellValue,
  };
};
