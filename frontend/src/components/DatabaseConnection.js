import React, { useState } from 'react';
import { Database, Plus, Save, ShieldCheck } from 'lucide-react';
import apiService from '../services/apiService';

const DatabaseConnection = () => {
  const [connectionDetails, setConnectionDetails] = useState({
    host: 'localhost',
    port: '27017',
    username: '',
    password: '',
    database: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setConnectionDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleConnect = async () => {
    try {
      const payload = {
        ...connectionDetails,
        db_type: 'mongodb'
      };

      const response = await apiService.connectDatabase(payload);

      if (response && response.available_collections) {
        alert(`Connected to MongoDB successfully! Available collections: ${response.available_collections.join(', ')}`);
      }
    } catch (error) {
      console.error('Database connection error:', error);
      alert(error.message || 'Failed to connect to MongoDB.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <Database className="w-8 h-8 text-primary-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">MongoDB Connection</h2>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Host
            </label>
            <input
              type="text"
              name="host"
              value={connectionDetails.host}
              onChange={handleInputChange}
              placeholder="localhost"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Port
            </label>
            <input
              type="text"
              name="port"
              value={connectionDetails.port}
              onChange={handleInputChange}
              placeholder="27017"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={connectionDetails.username}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={connectionDetails.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Database Name
          </label>
          <input
            type="text"
            name="database"
            value={connectionDetails.database}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          <div className="flex items-center text-sm text-gray-600">
            <ShieldCheck className="mr-2 w-5 h-5 text-green-500" />
            Secure connection
          </div>
          <button
            onClick={handleConnect}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Save className="mr-2 w-5 h-5" />
            Connect
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatabaseConnection;
