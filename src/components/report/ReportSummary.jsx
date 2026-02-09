export default function ReportSummary({ summary }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-gray-500 text-sm">Total Expense</p>
        <p className="text-xl font-bold">RM {summary.total}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-gray-500 text-sm">Avg / Day</p>
        <p className="text-xl font-bold">RM {summary.averagePerDay}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-gray-500 text-sm">Transactions</p>
        <p className="text-xl font-bold">{summary.count}</p>
      </div>
    </div>
  );
}
