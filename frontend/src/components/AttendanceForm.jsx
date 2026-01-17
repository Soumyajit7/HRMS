import React, { useState, useEffect } from 'react';

const AttendanceForm = ({ attendance, employees, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    date: '',
    status: 'present'
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (attendance) {
      setFormData({
        employee_id: attendance.employee_id || '',
        date: attendance.date || '',
        status: attendance.status || 'present'
      });
    } else {
      // Set today's date as default for new attendance
      setFormData(prev => ({
        ...prev,
        date: new Date().toISOString().split('T')[0]
      }));
    }
  }, [attendance]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.employee_id) {
      newErrors.employee_id = 'Employee is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.status) {
      newErrors.status = 'Status is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          {attendance ? 'Edit Attendance Record' : 'Mark Attendance'}
        </h3>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {errors.submit && (
          <div className="alert alert-error">
            {errors.submit}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="form-group">
            <label className="form-label">Employee *</label>
            <select
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              className={`input ${errors.employee_id ? 'border-red-500' : ''}`}
              disabled={!!attendance} // Disable changing employee for existing records
            >
              <option value="">Select an employee</option>
              {employees.map(emp => (
                <option key={emp.employee_id} value={emp.employee_id}>
                  {emp.full_name} ({emp.employee_id})
                </option>
              ))}
            </select>
            {errors.employee_id && (
              <p className="mt-1 text-sm text-red-600">{errors.employee_id}</p>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`input ${errors.date ? 'border-red-500' : ''}`}
              disabled={!!attendance} // Disable changing date for existing records
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`input ${errors.status ? 'border-red-500' : ''}`}
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status}</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : (attendance ? 'Update Record' : 'Mark Attendance')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AttendanceForm;