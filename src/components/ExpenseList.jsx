import React, { useState, useMemo } from "react";

export default function ExpenseList({ expenses, onDeleteExpense, onViewReceipt }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterMonth, setFilterMonth] = useState("All");
  const [sortBy, setSortBy] = useState("date-desc");

  const categories = ["All", "Food", "Transport", "Bills", "Entertainment", "Health", "Shopping", "Other"];

  // Get unique months from expenses
  const months = useMemo(() => {
    const monthSet = new Set();
    monthSet.add("All");
    expenses.forEach((exp) => {
      const monthKey = exp.date.substring(0, 7); // YYYY-MM
      monthSet.add(monthKey);
    });
    return Array.from(monthSet).sort().reverse();
  }, [expenses]);

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    let result = expenses.filter((exp) => {
      const matchesSearch =
        exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filterCategory === "All" || exp.category === filterCategory;
      
      const matchesMonth = filterMonth === "All" || exp.date.substring(0, 7) === filterMonth;

      return matchesSearch && matchesCategory && matchesMonth;
    });

    // Sort
    if (sortBy === "date-desc") {
      result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === "date-asc") {
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === "amount-desc") {
      result.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === "amount-asc") {
      result.sort((a, b) => a.amount - b.amount);
    }

    return result;
  }, [expenses, searchTerm, filterCategory, filterMonth, sortBy]);

  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const getCategoryIcon = (category) => {
    const icons = {
      Food: "🍔",
      Transport: "🚗",
      Bills: "📄",
      Entertainment: "🎬",
      Health: "💊",
      Shopping: "🛍️",
      Other: "📌",
    };
    return icons[category] || "💰";
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Expense History</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Month Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month === "All" ? "All Months" : new Date(month + "-01").toLocaleDateString("en-US", { year: "numeric", month: "long" })}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Total Amount */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-lg font-semibold text-gray-800">
          Total: <span className="text-blue-600">${totalAmount.toFixed(2)}</span>
        </p>
      </div>

      {/* Expense List */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No expenses found. Add your first expense to get started!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getCategoryIcon(expense.category)}</span>
                  <div>
                    <p className="font-semibold text-gray-800">{expense.description || expense.category}</p>
                    <p className="text-sm text-gray-500">
                      {expense.category} • {formatDate(expense.date)} • {expense.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <p className="font-bold text-gray-800 min-w-24 text-right">
                  ${expense.amount.toFixed(2)}
                </p>
                
                <div className="flex gap-2">
                  {expense.receipt && (
                    <button
                      onClick={() => onViewReceipt(expense)}
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition"
                      title="View Receipt"
                    >
                      📎
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteExpense(expense.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
