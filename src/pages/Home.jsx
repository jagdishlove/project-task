import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import CSVUploader from "../components/CSVUploader";
import TableComponent from "../components/Table";

const Home = () => {
  const [csvData, setCsvData] = useState({ headers: [], rows: [] });
  const handleDataParsed = (data) => {
    setCsvData(data);
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

      {csvData.headers.length > 0 && csvData.rows.length > 0 ? (
        <TableComponent headers={csvData.headers} rows={csvData.rows} />
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
