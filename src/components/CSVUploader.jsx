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
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />
    </div>
  );
};

export default CSVUploader;
