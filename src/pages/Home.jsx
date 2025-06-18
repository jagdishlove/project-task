import { Box } from "@mui/material";
import React, { useState } from "react";
import CSVUploader from "../components/CSVUploader";
import TableComponent from "../components/TableComponent";

const Home = () => {
  const [csvData, setCsvData] = useState({ headers: [], rows: [] });
  const handleDataParsed = (data) => {
    setCsvData(data);
  };

  console.log("csvData", csvData);

  return (
    <Box>
      <Box pb={5}>
        <CSVUploader onDataParsed={handleDataParsed} />
      </Box>
      {csvData.headers.length || csvData.rows.length ? (
        <TableComponent headers={csvData.headers} rows={csvData.rows} />
      ) : (
        <div style={{ textAlign: "center", padding: "1rem" }}>
          No data available.
        </div>
      )}
    </Box>
  );
};

export default Home;
