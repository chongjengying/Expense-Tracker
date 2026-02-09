import React, { useState, useEffect } from "react";
import AddExpense from "../components/AddExpense";
import ExpenseList from "../components/ExpenseList";
import Summary from "../components/Summary";
import ReceiptModal from "../components/ReceiptModal";
import ReportPage from "../components/report/ReportPage";

export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Load expenses from localStorage on mount
  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses");
    if (savedExpenses) {
      try {
        setExpenses(JSON.parse(savedExpenses));
      } catch (error) {
        console.error("Error loading expenses:", error);
      }
    }
  }, []);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const handleAddExpense = (expense) => {
    setExpenses((prev) => [expense, ...prev]);
    setActiveTab("history");
  };

  const handleDeleteExpense = (id) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    }
  };

  const handleViewReceipt = (expense) => {
    setSelectedReceipt(expense);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold">💰 Expense Tracker</h1>
          <p className="text-blue-100 mt-1">Track your daily expenses and take control of your money</p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8 border-b">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-4 px-1 font-medium transition-colors border-b-2 ${
                activeTab === "dashboard"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("add")}
              className={`py-4 px-1 font-medium transition-colors border-b-2 ${
                activeTab === "add"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              Add Expense
            </button>
                  <button
              onClick={() => setActiveTab("report")}
              className={`py-4 px-1 font-medium transition-colors border-b-2 ${
                activeTab === "report"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
             Report
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-4 px-1 font-medium transition-colors border-b-2 ${
                activeTab === "history"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              History
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>
            {expenses.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-2xl text-gray-500 mb-4">📊 No expenses yet</p>
                <p className="text-gray-600 mb-6">Start tracking your expenses by adding your first entry</p>
                <button
                  onClick={() => setActiveTab("add")}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Add First Expense
                </button>
              </div>
            ) : (
              <Summary expenses={expenses} />
            )}
          </div>
        )}

        {/* Add Expense Tab */}
        {activeTab === "add" && (
          <div>
            <AddExpense onAddExpense={handleAddExpense} />
            {expenses.length > 0 && (
              <div className="mt-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Recent Expenses</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {expenses.slice(0, 5).map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{expense.description || expense.category}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(expense.date + "T00:00:00").toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <p className="font-bold text-gray-800">${expense.amount.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Report Tab */}
        {activeTab === "report" && (
          <ReportPage expenses={expenses} />
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <ExpenseList
            expenses={expenses}
            onDeleteExpense={handleDeleteExpense}
            onViewReceipt={handleViewReceipt}
          />
        )}
      </main>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <ReceiptModal
          expense={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
}
