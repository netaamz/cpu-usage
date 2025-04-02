import { useState } from "react";
import Form from "./components/Form";
import CpuUsageChart from "./components/CpuUsageChart";

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleDataLoad = (loadedData) => {
    if (loadedData && loadedData.metrics) {
      setData(loadedData.metrics); // Extract metrics array
      setError(null);
    } else {
      setError("Invalid data format received");
      setData(null);
    }
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setData(null);
  };

  return (
    <>
      <div>
        <h1>AWS Instance CPU Usage</h1>
      </div>
      <Form onDataLoad={handleDataLoad} onError={handleError} />

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {data && (
        <>
          <CpuUsageChart data={data} />
        </>
      )}
    </>
  );
}

export default App;
