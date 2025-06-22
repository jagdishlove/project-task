import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import CSVUploader from "../components/CSVUploader";
import TableComponent from "../components/Table/TableComponent";

const Home = () => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const handleDataParsed = (data) => {
    if (!data?.headers || !Array.isArray(data.headers)) return;
    if (!data?.rows || !Array.isArray(data.rows)) return;

    const formattedColumns = data.headers.map((header) => ({
      accessorKey: header,
      header: header,
    }));

    setColumns(formattedColumns);
    setRows(data.rows);
  };

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
      }}
    >
      <Box pb={5}>
        <CSVUploader onDataParsed={handleDataParsed} />
      </Box>

      {columns.length > 0 && rows.length > 0 ? (
        <TableComponent headers={columns} rows={rows} />
      ) : (
        <Typography
          variant="body1"
          align="center"
          sx={{ mt: 4, color: "text.secondary" }}
        >
          No data available. Please upload a CSV file to display the table.
        </Typography>
      )}
    </Box>
  );
};

export default Home;
