import React, { useState } from "react";

const Form = ({ onDataLoad, onError }) => {
  const [form, setForm] = useState({
    time_period: "3", // Default to 'Last 3 Hours'
    period: "",
    ip: "",
  });

  const [errors, setErrors] = useState({
    period: "",
    ip: "",
  });

  const validateForm = () => {
    let isValid = true;
    let newErrors = { period: "", ip: "" };

    // Period validation
    if (!form.period) {
      newErrors.period = "Period is required.";
      isValid = false;
    }

    // IP validation 
    const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(form.ip)) {
      newErrors.ip = "Invalid IP address format.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLoad = async (event) => {
    event.preventDefault(); // Prevent default form submission

    if (!validateForm()) {
      onError("Form validation failed.");
      return;
    }

    const requestData = {
      time_period: form.time_period,
      period: form.period,
      ip: form.ip,
    };

    try {
      const response = await fetch("http://localhost:5000/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      // Pass the data up to the parent component
      const data = await response.json();
      onDataLoad(data);
    } catch (error) {
      console.error("Request failed:", error.message);
      onError(error.message);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  return (
    <div>
      <form onSubmit={handleLoad}>
        <p>
          <label>
            Time Period: 
            <select
              name="time_period"
              value={form.time_period}
              onChange={handleChange}
            >
              <option value="1">Last Hour</option>
              <option value="2">Last 2 Hours</option>
              <option value="3">Last 3 Hours</option>
              <option value="24">Last Day</option>
              <option value="72">Last 3 Days</option>
              <option value="168">Last Week</option>
            </select>
          </label>
        </p>
        <p>
          <label>
            Period: 
            <input
              type="text"
              name="period"
              value={form.period}
              onChange={handleChange}
              required
            />
            {errors.period && <span style={{ color: "red" }}>{errors.period}</span>}
          </label>
        </p>
        <label>
          IP Address: 
          <input
            type="text"
            name="ip"
            value={form.ip}
            onChange={handleChange}
            required
          />
          {errors.ip && <span style={{ color: "red" }}>{errors.ip}</span>}
        </label>

        <button type="submit">Load</button>
      </form>
    </div>
  );
};

export default Form;
