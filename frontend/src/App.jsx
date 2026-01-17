import React, { useState } from 'react';
import EmployeeManagement from './pages/EmployeeManagement';
import AttendanceManagement from './pages/AttendanceManagement';

const App = () => {
  const [activeTab, setActiveTab] = useState('employees');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">HRMS Lite</h1>
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('employees')}
                className={`nav-button ${
                  activeTab === 'employees'
                    ? 'nav-button active'
                    : 'text-gray-500'
                }`}
              >
                Employee Management
              </button>
              <button
                onClick={() => setActiveTab('attendance')}
                className={`nav-button ${
                  activeTab === 'attendance'
                    ? 'nav-button active'
                    : 'text-gray-500'
                }`}
              >
                Attendance Management
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'employees' ? <EmployeeManagement /> : <AttendanceManagement />}
      </main>
    </div>
  );
};

export default App;