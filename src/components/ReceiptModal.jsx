import React from "react";

export default function ReceiptModal({ expense, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Receipt</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Expense Details */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold text-gray-800">
                  {new Date(expense.date + "T00:00:00").toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-semibold text-gray-800">{expense.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-semibold text-gray-800">${expense.amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-semibold text-gray-800">{expense.paymentMethod}</p>
              </div>
            </div>
            {expense.description && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600">Description</p>
                <p className="font-semibold text-gray-800">{expense.description}</p>
              </div>
            )}
          </div>

          {/* Receipt Image */}
          {expense.receipt && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Receipt Image</p>
              <div className="bg-gray-100 rounded-lg p-2 flex justify-center">
                <img
                  src={expense.receipt}
                  alt="Receipt"
                  className="max-w-full max-h-96 rounded"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={() => {
              const link = document.createElement("a");
              link.href = expense.receipt;
              link.download = `receipt-${expense.id}.png`;
              link.click();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
          >
            Download Receipt
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md font-medium hover:bg-gray-400 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
