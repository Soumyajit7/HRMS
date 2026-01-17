import React from 'react';

const EmployeeTable = ({ employees, onEdit, onDelete }) => {
  if (employees.length === 0) {
    return (
      <div className="empty-state">
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new employee.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="table-container">
        <table className="table">
          <thead className="table-head">
            <tr>
              <th className="table-header">Employee ID</th>
              <th className="table-header">Full Name</th>
              <th className="table-header">Email</th>
              <th className="table-header">Department</th>
              <th className="table-header text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.employee_id} className="hover:bg-gray-50">
                <td className="table-cell font-medium text-gray-900">
                  {employee.employee_id}
                </td>
                <td className="table-cell">
                  {employee.full_name}
                </td>
                <td className="table-cell text-gray-500">
                  {employee.email}
                </td>
                <td className="table-cell">
                  <span className="department-badge">
                    {employee.department}
                  </span>
                </td>
                <td className="table-cell text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(employee)}
                      className="action-button edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(employee.employee_id)}
                      className="action-button delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeTable;