// src/App.jsx
// eslint-disable-next-line no-unused-vars
import React from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import EmployeeTable from "./components/EmployeeTable";

const initialEmployees = [
  {
    id: 101,
    name: "Virat",
    department: "IT",
    role: "Developer",
    salary: 50000,
    status: "Active",
  },
  {
    id: 102,
    name: "Smriti",
    department: "HR",
    role: "Recruiter",
    salary: 45000,
    status: "Inactive",
  },
  {
    id: 103,
    name: "Shreyanka",
    department: "Marketing",
    role: "Consulting",
    salary: 48000,
    status: "Active",
  },
];

const App = () => {
  return (
    <div>
      <EmployeeTable employees={initialEmployees} />
    </div>
  );
};

export default App;
