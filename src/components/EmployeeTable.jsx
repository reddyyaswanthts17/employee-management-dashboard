// src/components/EmployeeTable.jsx
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import {
  Button,
  Input,
  Form,
  InputNumber,
  Select,
  Switch,
  Modal,
  Popconfirm,
  message,
} from "antd";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ClientSideRowModelModule } from "ag-grid-community";
import "../styles/EmployeeTable.css";

const { Option } = Select;

// eslint-disable-next-line react/prop-types
const EmployeeTable = ({ employees }) => {
  const [rowData, setRowData] = useState(employees || []);
  console.log("Row Data:", rowData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    department: "",
    role: "",
    salary: "",
    status: "Active",
  });

  const [filters, setFilters] = useState({
    name: "",
    department: "",
    status: "",
  });

  const columnDefs = [
    {
      headerName: "Employee ID",
      field: "id",
      sortable: true,
      filter: true,
      checkboxSelection: true,
      flex: 1,
    },
    {
      headerName: "Name",
      field: "name",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Department",
      field: "department",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Role",
      field: "role",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Salary",
      field: "salary",
      sortable: true,
      filter: true,
      flex: 1,
    },
    {
      headerName: "Status",
      field: "status",
      sortable: true,
      filter: true,
      cellRenderer: (params) =>
        params.value === "Active" ? "Active" : "Inactive",
      flex: 1,
    },
    {
      headerName: "Actions",
      field: "actions",
      flex: 1,
      editable: false,
      cellRenderer: (params) => (
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Button
            type="primary"
            size="small"
            onClick={() => handleEdit(params.data)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this employee?"
            onConfirm={() => handleDelete(params.data.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleEditSave = (values) => {
    setRowData((prevData) =>
      prevData.map((emp) =>
        emp.id === editingEmployee.id ? { ...emp, ...values } : emp
      )
    );
    setIsEditModalOpen(false);
  };

  const handleDelete = (id) => {
    setRowData((prevData) => prevData.filter((emp) => emp.id !== id));
  };

  const handleAddEmployee = () => {
    if (
      !newEmployee.name ||
      !newEmployee.department ||
      !newEmployee.role ||
      !newEmployee.salary
    ) {
      Modal.error({
        title: "Error",
        content: "Please fill out all fields before adding an employee.",
      });
      return;
    }
    const newId = rowData.length ? rowData[rowData.length - 1].id + 1 : 1;
    setRowData((prevData) => [...prevData, { id: newId, ...newEmployee }]);
    setIsAddModalOpen(false);
    setNewEmployee({
      name: "",
      department: "",
      role: "",
      salary: "",
      status: "Active",
    });
    message.success("Employee added successfully.");
  };

  const exportToCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Name,Department,Role,Salary,Status"]
        .concat(
          rowData.map(
            (emp) =>
              `${emp.id},${emp.name},${emp.department},${emp.role},${emp.salary},${emp.status}`
          )
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employee_data.csv");
    document.body.appendChild(link);
    link.click();
  };

  const filteredEmployees = rowData.filter((emp) => {
    return (
      (filters.name === "" ||
        emp.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.department === "" || emp.department === filters.department) &&
      (filters.status === "" || emp.status === filters.status)
    );
  });

  return (
    <div className="dashboard-container">
      <h1>Employee Management Dashboard</h1>
      <div className="filters">
        <Input
          placeholder="Search by Name"
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <Select
          placeholder="Select Department"
          onChange={(value) => setFilters({ ...filters, department: value })}
          style={{ width: "150px" }}
        >
          <Option value="IT">IT</Option>
          <Option value="HR">HR</Option>
          <Option value="Accounting">Accounting</Option>
          <Option value="Marketing">Marketing</Option>
        </Select>
        <Switch
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          onChange={(checked) =>
            setFilters({ ...filters, status: checked ? "Active" : "Inactive" })
          }
        />
      </div>

      <div className="actions">
        <Button type="primary" onClick={() => setIsAddModalOpen(true)}>
          Add Employee
        </Button>
        <Button onClick={exportToCSV}>Export CSV</Button>
      </div>

      <div
        className="ag-theme-alpine"
        style={{ height: 500, width: "100%", minWidth: "800px" }}
      >
        <AgGridReact
          modules={[ClientSideRowModelModule]}
          rowData={filteredEmployees}
          columnDefs={columnDefs}
          defaultColDef={{ flex: 1, minWidth: 150, resizable: true }}
          pagination={true}
          paginationPageSize={10}
          rowSelection="multiple"
          theme="legacy"
          domLayout="autoHeight"
          suppressMovableColumns={true}
          animateRows={true}
        />
      </div>

      <Modal
        title="Edit Employee"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={() => document.getElementById("editFormSubmit").click()}
      >
        <Form
          key={editingEmployee?.id}
          initialValues={editingEmployee}
          onFinish={handleEditSave}
          layout="vertical"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: "Please input the role!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Salary"
            name="salary"
            rules={[{ required: true, message: "Please input the salary!" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Status" name="status" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>

          <button
            id="editFormSubmit"
            type="submit"
            style={{ display: "none" }}
          ></button>
        </Form>
      </Modal>

      <Modal
        title="Add Employee"
        open={isAddModalOpen}
        onOk={handleAddEmployee}
        onCancel={() => setIsAddModalOpen(false)}
      >
        <Input
          placeholder="Name"
          value={newEmployee.name}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, name: e.target.value })
          }
        />

        <Select
          value={newEmployee.department}
          onChange={(value) =>
            setNewEmployee({ ...newEmployee, department: value })
          }
          style={{ width: "100%" }}
        >
          <Option value="" disabled selected hidden>
            Select Department
          </Option>
          <Option value="IT">IT</Option>
          <Option value="HR">HR</Option>
          <Option value="Accounting">Accounting</Option>
          <Option value="Marketing">Marketing</Option>
        </Select>
        <Input
          placeholder="Role"
          value={newEmployee.role}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, role: e.target.value })
          }
        />
        <Input
          placeholder="Salary"
          type="number"
          value={newEmployee.salary}
          onChange={(e) =>
            setNewEmployee({
              ...newEmployee,
              salary: parseFloat(e.target.value) || 0,
            })
          }
        />
        <Select
          value={newEmployee.status}
          onChange={(value) =>
            setNewEmployee({ ...newEmployee, status: value })
          }
        >
          <Option value="Active">Active</Option>
          <Option value="Inactive">Inactive</Option>
        </Select>
      </Modal>
    </div>
  );
};

export default EmployeeTable;
