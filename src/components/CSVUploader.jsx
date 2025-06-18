import React from "react";
import { Box, Button, Typography } from "@mui/material";
import Papa from "papaparse";

const CSVUploader = ({ onDataParsed }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields; // array of headers
        const rows = results.data; // array of objects
        onDataParsed({ headers, rows });
      },
      error: (error) => {
        console.error("CSV parse error:", error);
      },
    });
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        p: 3,
        border: "2px dashed",
        borderColor: "primary.main",
        borderRadius: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="h6" mb={2}>
        Upload CSV File
      </Typography>
      <input
        accept=".csv"
        id="csv-file-input"
        type="file"
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />
      <label htmlFor="csv-file-input">
        <Button variant="contained" component="span" fullWidth>
          Choose File
        </Button>
      </label>
      <Typography variant="body2" color="textSecondary" mt={1}>
        Only .csv files are accepted.
      </Typography>
    </Box>
  );
};

export default CSVUploader;
