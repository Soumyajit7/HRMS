import React, { useState, useEffect } from 'react';
import { attendanceAPI, employeeAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import AttendanceForm from '../components/AttendanceForm';
import AttendanceTable from '../components/AttendanceTable';

const AttendanceManagement = () => {
  const [attendances, setAttendances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [filter, setFilter] = useState({
    employee_id: '',
    date_from: '',
    date_to: ''
  });

  useEffect(() => {
    fetchEmployees();
    fetchAttendances();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll();
      setEmployees(response.data);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    }
  };

  const fetchAttendances = async (filters = {}) => {
    try {
      setLoading(true);
      setError('');
      // Remove empty string values from filters
      const cleanFilters = {};
      Object.keys(filters).forEach(key => {
        if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
          cleanFilters[key] = filters[key];
        }
      });
      const response = await attendanceAPI.getAll(cleanFilters);
      setAttendances(response.data);
    } catch (err) {
      setError('Failed to fetch attendance records: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    const filters = {};
    if (filter.employee_id) filters.employee_id = filter.employee_id;
    if (filter.date_from && filter.date_from !== '') filters.date_from = filter.date_from;
    if (filter.date_to && filter.date_to !== '') filters.date_to = filter.date_to;
    fetchAttendances(filters);
  };

  const handleClearFilters = () => {
    setFilter({
      employee_id: '',
      date_from: '',
      date_to: ''
    });
    fetchAttendances();
  };

  const handleMarkAttendance = () => {
    setEditingAttendance(null);
    setShowForm(true);
  };

  const handleEditAttendance = (attendance) => {
    setEditingAttendance(attendance);
    setShowForm(true);
  };

  const handleDeleteAttendance = async (attendanceId) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await attendanceAPI.delete(attendanceId);
        fetchAttendances(filter.employee_id || (filter.date_from && filter.date_from !== '') || (filter.date_to && filter.date_to !== '') ? 
          { 
            employee_id: filter.employee_id || undefined, 
            date_from: (filter.date_from && filter.date_from !== '') ? filter.date_from : undefined, 
            date_to: (filter.date_to && filter.date_to !== '') ? filter.date_to : undefined 
          } : {});
      } catch (err) {
        setError('Failed to delete attendance record: ' + err.message);
      }
    }
  };

  const handleFormSubmit = async (attendanceData) => {
    try {
      if (editingAttendance) {
        await attendanceAPI.update(editingAttendance.id, attendanceData);
      } else {
        await attendanceAPI.create(attendanceData);
      }
      setShowForm(false);
      setEditingAttendance(null);
      fetchAttendances(filter.employee_id || (filter.date_from && filter.date_from !== '') || (filter.date_to && filter.date_to !== '') ? 
        { 
          employee_id: filter.employee_id || undefined, 
          date_from: (filter.date_from && filter.date_from !== '') ? filter.date_from : undefined, 
          date_to: (filter.date_to && filter.date_to !== '') ? filter.date_to : undefined 
        } : {});
    } catch (err) {
      throw new Error(err.response?.data?.detail || err.message);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAttendance(null);
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
        <h2 className="text-2xl font-bold text-gray-900">Attendance Management</h2>
        <button
          onClick={handleMarkAttendance}
          className="btn btn-primary"
          disabled={employees.length === 0}
        >
          Mark Attendance
        </button>
      </div>

      {employees.length === 0 && (
        <div className="alert alert-info">
          Please add employees first before marking attendance.
        </div>
      )}

      {/* Filters */}
      <div className="filter-section">
        <h3>Filter Attendance Records</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="form-group">
            <label className="form-label">Employee</label>
            <select
              value={filter.employee_id}
              onChange={(e) => handleFilterChange('employee_id', e.target.value)}
              className="input"
            >
              <option value="">All Employees</option>
              {employees.map(emp => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.full_name} ({emp.employee_id})
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">From Date</label>
            <input
              type="date"
              value={filter.date_from}
              onChange={(e) => handleFilterChange('date_from', e.target.value)}
              className="input"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">To Date</label>
            <input
              type="date"
              value={filter.date_to}
              onChange={(e) => handleFilterChange('date_to', e.target.value)}
              className="input"
            />
          </div>
          
          <div className="form-group flex items-end space-x-2">
            <button
              onClick={handleApplyFilters}
              className="btn btn-primary"
            >
              Apply Filters
            </button>
            <button
              onClick={handleClearFilters}
              className="btn btn-secondary"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {showForm ? (
        <AttendanceForm
          attendance={editingAttendance}
          employees={employees}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
        />
      ) : (
        <AttendanceTable
          attendances={attendances}
          employees={employees}
          onEdit={handleEditAttendance}
          onDelete={handleDeleteAttendance}
        />
      )}

      {attendances.length === 0 && !showForm && (
        <div className="empty-state">
          <div className="text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No attendance records</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by marking attendance for employees.</p>
            <div className="mt-6">
              <button
                onClick={handleMarkAttendance}
                className="btn btn-primary"
                disabled={employees.length === 0}
              >
                Mark Attendance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceManagement;