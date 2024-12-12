import React, { useState } from 'react';
import { 
  Database, 
  Play, 
  CodeIcon, 
  Zap, 
  FileText, 
  BarChart2 
} from 'lucide-react';
import  apiService  from '../services/apiService';

const QueryInterface = () => {
  const [queryType, setQueryType] = useState('');
  const [queryText, setQueryText] = useState('');
  const [queryResults, setQueryResults] = useState(null);
  const [optimizationDetails, setOptimizationDetails] = useState(null);

  const handleQueryExecution = async () => {
    try {
      const payload = {
        query: queryText,
        db_type: queryType  // mysql or mongodb
      };

      const response = await apiService.executeQuery(payload);
      
      setQueryResults(response.results);
      setOptimizationDetails(response.optimization_details);
    } catch (error) {
      console.error('Query execution failed:', error);
      alert('Failed to execute query');
    }
  };

  const renderResults = () => {
    if (!queryResults) return null;

    return (
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center mb-4">
          <FileText className="w-6 h-6 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Query Results</h3>
        </div>
        
        <div className="max-h-64 overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                {queryResults.length > 0 && Object.keys(queryResults[0]).map(key => (
                  <th key={key} className="p-2 text-left border">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {queryResults.map((row, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  {Object.values(row).map((value, cellIndex) => (
                    <td key={cellIndex} className="p-2 text-sm">{JSON.stringify(value)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderOptimizationDetails = () => {
    if (!optimizationDetails) return null;

    return (
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <div className="flex items-center mb-4">
          <Zap className="w-6 h-6 text-primary-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">AI Query Optimization</h3>
        </div>
        
        <div className="space-y-2">
          <div>
            <span className="font-medium">Original Query:</span>
            <pre className="bg-white p-2 rounded text-sm overflow-auto">
              {optimizationDetails.original_query}
            </pre>
          </div>
          <div>
            <span className="font-medium">Optimized Query:</span>
            <pre className="bg-white p-2 rounded text-sm overflow-auto">
              {optimizationDetails.optimized_query}
            </pre>
          </div>
          <div>
            <span className="font-medium">Explanation:</span>
            <p className="bg-white p-2 rounded text-sm">
              {optimizationDetails.explanation}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center mb-6">
        <CodeIcon className="w-8 h-8 text-primary-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-800">Query Interface</h2>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Database Type
        </label>
        <div className="flex space-x-4">
          {['mysql', 'mongodb'].map(type => (
            <button
              key={type}
              onClick={() => setQueryType(type)}
              className={`px-4 py-2 rounded-lg flex items-center ${
                queryType === type 
                  ? 'bg-primary-100 text-primary-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <Database className="mr-2 w-5 h-5" />
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {queryType && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enter Query
            </label>
            <textarea
              rows={6}
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              placeholder={`Enter your ${queryType.toUpperCase()} query here...`}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <button 
                className="flex items-center px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                onClick={handleQueryExecution}
              >
                <Play className="mr-2 w-5 h-5" />
                Execute Query
              </button>
              <button 
                className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                <BarChart2 className="mr-2 w-5 h-5" />
                Explain Query
              </button>
            </div>
          </div>

          {renderResults()}
          {renderOptimizationDetails()}
        </div>
      )}
    </div>
  );
};

export default QueryInterface;