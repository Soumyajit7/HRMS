import React, { useState, useEffect } from 'react';
import { employeeAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmployeeForm from '../components/EmployeeForm';
import EmployeeTable from '../components/EmployeeTable';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to fetch employees: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeAPI.delete(employeeId);
        fetchEmployees(); // Refresh the list
      } catch (err) {
        setError('Failed to delete employee: ' + err.message);
      }
    }
  };

  const handleFormSubmit = async (employeeData) => {
    try {
      if (editingEmployee) {
        await employeeAPI.update(editingEmployee.employee_id, employeeData);
      } else {
        await employeeAPI.create(employeeData);
      }
      setShowForm(false);
      setEditingEmployee(null);
      fetchEmployees();
    } catch (err) {
      throw new Error(err.response?.data?.detail || err.message);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
        <button
          onClick={handleCreateEmployee}
          className="btn btn-primary"
        >
          Add New Employee
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {showForm ? (
        <EmployeeForm
          employee={editingEmployee}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
        />
      ) : (
        <EmployeeTable
          employees={employees}
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployee}
        />
      )}

      {employees.length === 0 && !showForm && (
        <div className="empty-state">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No employees</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new employee.</p>
            <div className="mt-6">
              <button
                onClick={handleCreateEmployee}
                className="btn btn-primary"
              >
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;