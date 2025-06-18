// ExportCSVButton.jsx
import React from "react";
import Button from "@mui/material/Button";
import Papa from "papaparse";

const ExportCSVButton = ({ data, filename = "table_data.csv" }) => {
  const handleExport = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleExport}
      sx={{ ml: 2 }}
    >
      Export CSV
    </Button>
  );
};

export default ExportCSVButton;
