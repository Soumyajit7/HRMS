import React, { useState, useEffect } from 'react';

const EmployeeForm = ({ employee, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    full_name: '',
    email: '',
    department: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        employee_id: employee.employee_id || '',
        full_name: employee.full_name || '',
        email: employee.email || '',
        department: employee.department || ''
      });
    }
  }, [employee]);

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
    
    if (!formData.employee_id.trim()) {
      newErrors.employee_id = 'Employee ID is required';
    }
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
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
          {employee ? 'Edit Employee' : 'Add New Employee'}
        </h3>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {errors.submit && (
          <div className="alert alert-error">
            {errors.submit}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="form-group">
            <label className="form-label">Employee ID *</label>
            <input
              type="text"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              className={`input ${errors.employee_id ? 'border-red-500' : ''}`}
              placeholder="Enter employee ID"
              disabled={!!employee} // Disable editing employee ID for existing employees
            />
            {errors.employee_id && (
              <p className="mt-1 text-sm text-red-600">{errors.employee_id}</p>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={`input ${errors.full_name ? 'border-red-500' : ''}`}
              placeholder="Enter full name"
            />
            {errors.full_name && (
              <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input ${errors.email ? 'border-red-500' : ''}`}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">Department *</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`input ${errors.department ? 'border-red-500' : ''}`}
              placeholder="Enter department"
            />
            {errors.department && (
              <p className="mt-1 text-sm text-red-600">{errors.department}</p>
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
            {submitting ? 'Saving...' : (employee ? 'Update Employee' : 'Add Employee')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;