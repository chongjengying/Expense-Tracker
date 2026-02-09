import React, { useMemo } from "react";

export default function Summary({ expenses }) {
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

  // Current Month Summary
  const currentDate = new Date();
  const currentMonth = currentDate.toISOString().substring(0, 7);

  const currentMonthExpenses = useMemo(() => {
    return expenses.filter((exp) => exp.date.substring(0, 7) === currentMonth);
  }, [expenses, currentMonth]);

  const currentMonthTotal = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryBreakdown = useMemo(() => {
    const breakdown = {};
    currentMonthExpenses.forEach((exp) => {
      breakdown[exp.category] = (breakdown[exp.category] || 0) + exp.amount;
    });
    return Object.entries(breakdown)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [currentMonthExpenses]);

  // Weekly Summary
  const weeklyBreakdown = useMemo(() => {
    const today = new Date();
    const weekData = {};

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      weekData[dateStr] = { dayName, amount: 0 };
    }

    expenses.forEach((exp) => {
      if (weekData[exp.date]) {
        weekData[exp.date].amount += exp.amount;
      }
    });

    return Object.entries(weekData)
      .map(([date, { dayName, amount }]) => ({ date, dayName, amount }))
      .reverse();
  }, [expenses]);

  const maxWeeklyAmount = Math.max(...weeklyBreakdown.map((w) => w.amount), 1);

  // Last Month Comparison
  const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    .toISOString()
    .substring(0, 7);

  const lastMonthExpenses = useMemo(() => {
    return expenses.filter((exp) => exp.date.substring(0, 7) === lastMonth);
  }, [expenses, lastMonth]);

  const lastMonthTotal = lastMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const monthChange = lastMonthTotal ? (((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      {/* Current Month Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
          <p className="text-sm opacity-90">Current Month Total</p>
          <p className="text-4xl font-bold mt-2">${currentMonthTotal.toFixed(2)}</p>
          <p className="text-sm mt-4 opacity-90">
            {new Date(currentMonth + "-01").toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className={`rounded-lg shadow-md p-6 text-white ${
          monthChange >= 0 ? "bg-gradient-to-br from-red-500 to-red-600" : "bg-gradient-to-br from-green-500 to-green-600"
        }`}>
          <p className="text-sm opacity-90">vs Last Month</p>
          <p className="text-4xl font-bold mt-2">
            {monthChange >= 0 ? "+" : ""}{monthChange}%
          </p>
          <p className="text-sm mt-4 opacity-90">
            Last month: ${lastMonthTotal.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Spending by Category (This Month)</h3>
        {categoryBreakdown.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No expenses this month</p>
        ) : (
          <div className="space-y-3">
            {categoryBreakdown.map(({ category, amount }) => {
              const percentage = (amount / currentMonthTotal) * 100;
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getCategoryIcon(category)}</span>
                      <span className="font-medium text-gray-700">{category}</span>
                    </div>
                    <span className="font-semibold text-gray-800">${amount.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Weekly Trend */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Spending Trend</h3>
        <div className="flex items-end justify-between gap-2 h-40">
          {weeklyBreakdown.map(({ dayName, amount }) => (
            <div key={dayName} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all hover:opacity-80"
                style={{
                  height: `${maxWeeklyAmount > 0 ? (amount / maxWeeklyAmount) * 100 : 5}%`,
                  minHeight: "5px",
                }}
                title={`${dayName}: $${amount.toFixed(2)}`}
              ></div>
              <p className="text-xs text-gray-600 mt-2">{dayName}</p>
              <p className="text-xs font-semibold text-gray-700">${amount.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
