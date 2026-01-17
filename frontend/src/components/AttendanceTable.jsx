import React from 'react';

const AttendanceTable = ({ attendances, employees, onEdit, onDelete }) => {
  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.employee_id === employeeId);
    return employee ? employee.full_name : employeeId;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (attendances.length === 0) {
    return (
      <div className="empty-state">
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No attendance records found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by marking attendance for employees.</p>
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
              <th className="table-header">Employee</th>
              <th className="table-header">Date</th>
              <th className="table-header">Status</th>
              <th className="table-header text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {attendances.map((attendance) => (
              <tr key={`${attendance.employee_id}-${attendance.date}`} className="hover:bg-gray-50">
                <td className="table-cell">
                  <div>
                    <div className="font-medium text-gray-900">
                      {getEmployeeName(attendance.employee_id)}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {attendance.employee_id}
                    </div>
                  </div>
                </td>
                <td className="table-cell">
                  {formatDate(attendance.date)}
                </td>
                <td className="table-cell">
                  <span className={attendance.status === 'present' ? 'status-present' : 'status-absent'}>
                    {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
                  </span>
                </td>
                <td className="table-cell text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => onEdit(attendance)}
                      className="action-button edit-button"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(attendance.id)}
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
      
      {/* Summary */}
      <div className="summary-bar">
        <div className="flex justify-between items-center text-sm">
          <div className="text-gray-700">
            Showing <span className="font-medium">{attendances.length}</span> attendance records
          </div>
          <div className="flex space-x-4">
            <div className="summary-item">
              <span className="status-present">Present:</span>
              <span className="font-medium">
                {attendances.filter(a => a.status === 'present').length}
              </span>
            </div>
            <div className="summary-item">
              <span className="status-absent">Absent:</span>
              <span className="font-medium">
                {attendances.filter(a => a.status === 'absent').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTable;