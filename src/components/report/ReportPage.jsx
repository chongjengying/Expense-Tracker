import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ReportPage({ expenses = [] }) {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "All"
  });
  
  const [filteredExpenses, setFilteredExpenses] = useState(expenses);
  const reportRef = useRef(null);

  // Get unique categories from expenses
  const categories = ["All", ...new Set(expenses.map(exp => exp.category))];

  // Update filtered expenses when filters or expenses change
  useEffect(() => {
    let filtered = expenses;

    // Filter by date range
    if (filters.startDate) {
      filtered = filtered.filter(exp => new Date(exp.date) >= new Date(filters.startDate));
    }
    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(exp => new Date(exp.date) <= endDate);
    }

    // Filter by category
    if (filters.category !== "All") {
      filtered = filtered.filter(exp => exp.category === filters.category);
    }

    setFilteredExpenses(filtered);
  }, [filters, expenses]);

  // Calculate summary statistics
  const summary = {
    total: filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0),
    count: filteredExpenses.length,
    average: filteredExpenses.length > 0 ? filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0) / filteredExpenses.length : 0,
    byCategory: Object.fromEntries(
      Object.entries(
        filteredExpenses.reduce((acc, exp) => {
          acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1])
    )
  };

  // Export to PDF
  const exportPDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 297; // A4 height in mm

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save(`expense-report-${new Date().toLocaleDateString()}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF");
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Expense Report</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
            <button
              onClick={() => setFilters({ startDate: "", endDate: "", category: "All" })}
              className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div ref={reportRef} className="bg-white rounded-lg shadow-md p-8">
        {/* Header */}
        <div className="mb-8 pb-6 border-b">
          <h3 className="text-3xl font-bold text-gray-800">Expense Report</h3>
          <p className="text-gray-600 mt-2">
            Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </p>
          {(filters.startDate || filters.endDate || filters.category !== "All") && (
            <p className="text-gray-600 mt-2 text-sm">
              Filters: 
              {filters.startDate && ` From ${new Date(filters.startDate).toLocaleDateString()}`}
              {filters.endDate && ` to ${new Date(filters.endDate).toLocaleDateString()}`}
              {filters.category !== "All" && ` Category: ${filters.category}`}
            </p>
          )}
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-2xl text-gray-500 mb-2">No expenses found</p>
            <p className="text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                <p className="text-gray-600 text-sm font-medium">Total Expense</p>
                <p className="text-3xl font-bold text-blue-700 mt-2">
                  ${summary.total.toFixed(2)}
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                <p className="text-gray-600 text-sm font-medium">Average Expense</p>
                <p className="text-3xl font-bold text-green-700 mt-2">
                  ${summary.average.toFixed(2)}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                <p className="text-gray-600 text-sm font-medium">Total Transactions</p>
                <p className="text-3xl font-bold text-purple-700 mt-2">
                  {summary.count}
                </p>
              </div>
            </div>

            {/* Category Breakdown */}
            {Object.keys(summary.byCategory).length > 0 && (
              <div className="mb-8">
                <h4 className="text-xl font-bold text-gray-800 mb-4">💳 By Category</h4>
                <div className="space-y-2">
                  {Object.entries(summary.byCategory).map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{category}</span>
                      <span className="font-bold text-gray-800">${amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expense Table */}
            <div>
              <h4 className="text-xl font-bold text-gray-800 mb-4">📋 Detailed Expenses</h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-200 border-b-2 border-gray-300">
                      <th className="px-4 py-3 text-left font-semibold text-gray-800">Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-800">Description</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-800">Category</th>
                      <th className="px-4 py-3 text-right font-semibold text-gray-800">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpenses.map((expense) => (
                      <tr key={expense.id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-700">
                          {new Date(expense.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-gray-700">{expense.description || "-"}</td>
                        <td className="px-4 py-3">
                          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-gray-800">
                          ${expense.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Export Button */}
      {filteredExpenses.length > 0 && (
        <div className="flex justify-end gap-4">
          <button
            onClick={exportPDF}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition font-medium flex items-center gap-2"
          >
            📄 Export as PDF
          </button>
        </div>
      )}
    </div>
  );
}
