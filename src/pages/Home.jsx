import { Box } from "@mui/material";
import React, { useState } from "react";
import CSVUploader from "../components/CSVUploader";
import TableComponent from "../components/TableComponent";

const Home = () => {
  const [csvData, setCsvData] = useState({ headers: [], rows: [] });
  const handleDataParsed = (data) => {
    setCsvData(data);
  };

  return (
    <Box>
      <CSVUploader onDataParsed={handleDataParsed} />
      <TableComponent headers={csvData.headers} rows={csvData.rows} />
    </Box>
  );
};

export default Home;
