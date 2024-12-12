import React, { useState } from 'react';
import { Database, BarChart2, Settings, User, Search, RefreshCw, LogOut } from 'lucide-react';
import DatabaseConnection from './DatabaseConnection';  // Assuming DatabaseConnection is a separate component for managing DB connections

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('databases');
  const [dbType, setDbType] = useState('mongodb');  // Default to MongoDB

  const handleLogout = () => {
    // Clear user session or token here
    console.log("User logged out");
    // Redirect to login page
    window.location.href = "/login"; // Replace with your actual login route
  };

  const renderContent = () => {
    switch(activeSection) {
      case 'databases':
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Your Databases</h2>
            <div className="grid grid-cols-1 gap-4">
              {/* MongoDB card only for now */}
              <div className="border p-4 rounded-lg hover:shadow-md transition cursor-pointer"
                   onClick={() => setActiveSection('database-connection')}>
                <Database className="w-10 h-10 text-primary-600 mb-2" />
                <h3 className="font-semibold">MongoDB Database</h3>
                <p className="text-sm text-gray-500">localhost:27017</p>
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Query Analytics</h2>
            {/* Add chart or analytics visualization */}
          </div>
        );
      case 'database-connection':
        return <DatabaseConnection />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-6 flex flex-col justify-between">
        <div>
          <div className="mb-10">
            <h1 className="text-2xl font-bold text-primary-600">Query AI</h1>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveSection('databases')}
              className={`w-full flex items-center p-3 rounded-lg ${
                activeSection === 'databases' 
                  ? 'bg-primary-100 text-primary-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Database className="mr-3 w-5 h-5" />
              Databases
            </button>
            
            <button 
              onClick={() => setActiveSection('analytics')}
              className={`w-full flex items-center p-3 rounded-lg ${
                activeSection === 'analytics' 
                  ? 'bg-primary-100 text-primary-800' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart2 className="mr-3 w-5 h-5" />
              Analytics
            </button>

            <button 
              className="w-full flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <Settings className="mr-3 w-5 h-5" />
              Settings
            </button>

            <button 
              className="w-full flex items-center p-3 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <User className="mr-3 w-5 h-5" />
              Profile
            </button>
          </nav>
        </div>

        {/* Logout Button */}
        <button 
          onClick={handleLogout}
          className="w-full flex items-center p-3 rounded-lg text-gray-600 hover:bg-red-100 hover:text-red-600"
        >
          <LogOut className="mr-3 w-5 h-5" />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <header className="mb-8 flex justify-between items-center">
          <div className="relative flex-grow mr-4">
            <input 
              type="text" 
              placeholder="Search databases, queries..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          </div>
          
          <button className="p-2 bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200">
            <RefreshCw className="w-5 h-5" />
          </button>
        </header>

        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
