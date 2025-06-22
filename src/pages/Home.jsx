import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import CSVUploader from "../components/CSVUploader";
import TableComp from "../components/Table/Table";

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
        p: { xs: 2, sm: 4 },
        maxWidth: 1200,
        mx: "auto",
      }}
    >
      <Box pb={5}>
        <CSVUploader onDataParsed={handleDataParsed} />
      </Box>

      {columns.length > 0 && rows.length > 0 ? (
        <TableComp headers={columns} rows={rows} />
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
