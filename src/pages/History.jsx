import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getHistory } from "../api/wallet";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const History = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    startDate: "",
    endDate: ""
  });

  const { data, isLoading } = useQuery({
    queryKey: ["history", page, filters],
    queryFn: () =>
      getHistory({
        page,
        limit: 10,
        status: filters.status || undefined,
        type: filters.type || undefined,
        start_date: filters.startDate || undefined,
        end_date: filters.endDate || undefined,
      }),
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      type: "",
      startDate: "",
      endDate: ""
    });
    setPage(1);
  };

  if (isLoading) return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Loading transaction history...</p>
    </div>
  );

  const transactions = data?.data || [];

  const chartData = transactions.map((tx, idx) => ({
    name: `Tx ${idx + 1}`,
    amount: Math.abs(Number(tx.amount)),
    type: tx.type
  }));

  const getTransactionIcon = (type) => {
    switch (type) {
      case "ADD_MONEY": return "💰";
      case "TRANSFER": return "📤";
      case "RECEIVE": return "📥";
      default: return "💳";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "SUCCESS": return "#10b981";
      case "FAILED": return "#ef4444";
      case "PENDING": return "#f59e0b";
      default: return "#6b7280";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "SUCCESS": return "✅";
      case "FAILED": return "❌";
      case "PENDING": return "⏳";
      default: return "ℹ️";
    }
  };

  const getAmountColor = (type) => {
    return type === "RECEIVE" || type === "ADD_MONEY" ? "#10b981" : "#ef4444";
  };

  const getAmountPrefix = (type) => {
    return type === "RECEIVE" || type === "ADD_MONEY" ? "+" : "-";
  };

  const getTypeDisplayName = (type) => {
    return type.split('_').map(word => 
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const getTransactionCategory = (type) => {
    switch (type) {
      case "ADD_MONEY": return "Deposit";
      case "RECEIVE": return "Income";
      case "TRANSFER": return "Transfer";
      default: return "Transaction";
    }
  };

  return (
    <div className="history-container">
      {/* Header Section */}
      <header className="history-header">
        <div className="header-content">
          <h1 className="header-title">Transaction History</h1>
          <p className="header-subtitle">Track your spending and income with detailed analytics</p>
        </div>
      </header>

      {/* Filters Section */}
      <section className="filters-section">
        <div className="filters-header">
          <h2 className="filters-title">Filters</h2>
          <button 
            className="clear-filters-btn"
            onClick={clearFilters}
          >
            Clear All
          </button>
        </div>

        <div className="filters-grid">
          {/* Status Filter */}
          <div className="filter-group">
            <label className="filter-label">Status</label>
            <select 
              className="filter-select"
              value={filters.status} 
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">All Status</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="filter-group">
            <label className="filter-label">Type</label>
            <select 
              className="filter-select"
              value={filters.type} 
              onChange={(e) => handleFilterChange("type", e.target.value)}
            >
              <option value="">All Types</option>
              <option value="ADD_MONEY">Add Money</option>
              <option value="TRANSFER">Transfer</option>
              <option value="RECEIVE">Receive</option>
            </select>
          </div>

          {/* Date Filters */}
          <div className="filter-group">
            <label className="filter-label">From Date</label>
            <input 
              type="date" 
              className="filter-input"
              value={filters.startDate} 
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">To Date</label>
            <input 
              type="date" 
              className="filter-input"
              value={filters.endDate} 
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Transactions List */}
        <section className="transactions-section">
          <div className="section-header">
            <h2 className="section-title">Recent Transactions</h2>
          </div>

          {transactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <h3 className="empty-title">No transactions found</h3>
              <p className="empty-description">
                Try adjusting your filters or select a different date range
              </p>
            </div>
          ) : (
            <div className="transactions-list">
              {transactions.map((tx, index) => (
                <div 
                  key={tx.id} 
                  className="transaction-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="transaction-icon">
                    {getTransactionIcon(tx.type)}
                  </div>
                  
                  <div className="transaction-details">
                    <div className="transaction-main">
                      <div className="transaction-info">
                        <h4 className="transaction-type">
                          {getTypeDisplayName(tx.type)}
                        </h4>
                        <p className="transaction-counterparty">
                          {tx.counterparty || "Wallet System"}
                        </p>
                        <div className="transaction-meta">
                          <span className="transaction-category">
                            {getTransactionCategory(tx.type)}
                          </span>
                          {tx.date && (
                            <span className="transaction-date">
                              {new Date(tx.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="transaction-amount-section">
                        <span 
                          className="transaction-amount"
                          style={{ color: getAmountColor(tx.type) }}
                        >
                          {getAmountPrefix(tx.type)}₹{Math.abs(Number(tx.amount)).toLocaleString()}
                        </span>
                        <div 
                          className="transaction-status"
                          style={{ 
                            color: getStatusColor(tx.status),
                            backgroundColor: `${getStatusColor(tx.status)}15`
                          }}
                        >
                          <span className="status-icon">
                            {getStatusIcon(tx.status)}
                          </span>
                          {tx.status}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {transactions.length > 0 && (
            <div className="pagination">
              <button 
                className="pagination-btn"
                disabled={!data?.prev_page} 
                onClick={() => setPage(page - 1)}
              >
                ← Previous
              </button>
              
              <div className="pagination-info">
                <span className="page-info">
                  Page {data?.page} of {data?.total_pages}
                </span>
                <span className="total-info">
                  {data?.total_records || 0} total records
                </span>
              </div>
              
              <button 
                className="pagination-btn"
                disabled={!data?.next_page} 
                onClick={() => setPage(page + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </section>

        {/* Analytics Chart */}
        {transactions.length > 0 && (
          <section className="analytics-section">
            <div className="section-header">
              <h2 className="section-title">Spending Analytics</h2>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="var(--border-color)" 
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="name" 
                    stroke="var(--text-secondary)"
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="var(--text-secondary)"
                    fontSize={12}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip 
                    contentStyle={{
                      background: "var(--surface)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "12px",
                      color: "var(--text-primary)",
                      boxShadow: "0 8px 32px rgba(0,0,0,0.1)"
                    }}
                    formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Amount"]}
                    labelStyle={{ fontWeight: "600", marginBottom: "8px" }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="var(--primary)" 
                    strokeWidth={3}
                    dot={{ 
                      fill: "var(--primary)", 
                      strokeWidth: 2, 
                      r: 4,
                      stroke: "var(--surface)"
                    }}
                    activeDot={{ 
                      r: 6, 
                      fill: "var(--primary)",
                      stroke: "var(--surface)",
                      strokeWidth: 2
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ background: "var(--primary)" }}></div>
                <span>Transaction Amount</span>
              </div>
            </div>
          </section>
        )}
      </div>

      <style jsx>{`
        :root {
          --primary: #6366f1;
          --primary-light: #818cf8;
          --primary-dark: #4f46e5;
          --secondary: #8b5cf6;
          --success: #10b981;
          --warning: #f59e0b;
          --error: #ef4444;
          --background: #0f172a;
          --surface: #1e293b;
          --surface-light: #334155;
          --text-primary: #f8fafc;
          --text-secondary: #cbd5e1;
          --text-tertiary: #64748b;
          --border-color: #334155;
          --border-light: #475569;
        }

        .history-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 24px 20px;
          min-height: 100vh;
          background: var(--background);
        }

        /* Header Styles */
        .history-header {
          margin-bottom: 32px;
          animation: fadeInUp 0.6s ease-out;
        }

        .header-content {
          text-align: center;
        }

        .header-title {
          font-size: 36px;
          font-weight: 800;
          color: var(--text-primary);
          margin-bottom: 12px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.5px;
        }

        .header-subtitle {
          font-size: 18px;
          color: var(--text-secondary);
          margin: 0;
          font-weight: 500;
        }

        /* Filters Section */
        .filters-section {
          background: linear-gradient(135deg, var(--surface), var(--surface-light));
          border-radius: 20px;
          padding: 28px;
          margin-bottom: 32px;
          border: 1px solid var(--border-light);
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          animation: fadeInUp 0.6s ease-out 0.1s both;
        }

        .filters-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .filters-title {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .filters-title::before {
          content: '';
          width: 4px;
          height: 24px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          border-radius: 2px;
        }

        .clear-filters-btn {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: var(--error);
          padding: 10px 20px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .clear-filters-btn:hover {
          background: rgba(239, 68, 68, 0.2);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .filter-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .filter-select,
        .filter-input {
          padding: 14px 16px;
          border: 1px solid var(--border-light);
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.8);
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .filter-select:hover,
        .filter-input:hover {
          border-color: var(--primary-light);
        }

        .filter-select:focus,
        .filter-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
          background: rgba(15, 23, 42, 0.9);
        }

        /* Content Grid */
        .content-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 32px;
          align-items: start;
        }

        @media (max-width: 1024px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Transactions Section */
        .transactions-section,
        .analytics-section {
          background: linear-gradient(135deg, var(--surface), var(--surface-light));
          border-radius: 20px;
          padding: 28px;
          border: 1px solid var(--border-light);
          box-shadow: 0 8px 32px rgba(0,0,0,0.15);
          animation: fadeInUp 0.6s ease-out 0.2s both;
        }

        .section-header {
          margin-bottom: 28px;
        }

        .section-title {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-title::before {
          content: '';
          width: 4px;
          height: 20px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          border-radius: 2px;
        }

        /* Transactions List */
        .transactions-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .transaction-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid var(--border-light);
          border-radius: 16px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          animation: slideInRight 0.5s ease-out both;
          backdrop-filter: blur(10px);
        }

        .transaction-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.25);
          border-color: var(--primary-light);
          background: rgba(15, 23, 42, 0.8);
        }

        .transaction-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .transaction-details {
          flex: 1;
          min-width: 0;
        }

        .transaction-main {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
        }

        .transaction-info {
          flex: 1;
          min-width: 0;
        }

        .transaction-type {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 6px 0;
        }

        .transaction-counterparty {
          font-size: 14px;
          color: var(--text-secondary);
          margin: 0 0 12px 0;
          font-weight: 500;
        }

        .transaction-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 12px;
          color: var(--text-tertiary);
        }

        .transaction-category {
          background: rgba(99, 102, 241, 0.1);
          color: var(--primary-light);
          padding: 6px 12px;
          border-radius: 8px;
          font-weight: 600;
          border: 1px solid rgba(99, 102, 241, 0.2);
        }

        .transaction-date {
          font-weight: 500;
        }

        .transaction-amount-section {
          text-align: right;
          flex-shrink: 0;
        }

        .transaction-amount {
          font-size: 20px;
          font-weight: 800;
          display: block;
          margin-bottom: 8px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .transaction-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 1px solid;
          backdrop-filter: blur(10px);
        }

        .status-icon {
          font-size: 10px;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 80px 20px;
          color: var(--text-secondary);
        }

        .empty-icon {
          font-size: 80px;
          margin-bottom: 24px;
          opacity: 0.5;
          animation: pulse 2s infinite;
        }

        .empty-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .empty-description {
          font-size: 16px;
          margin: 0;
          opacity: 0.8;
          font-weight: 500;
        }

        /* Pagination */
        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 32px;
          padding-top: 28px;
          border-top: 1px solid var(--border-light);
        }

        .pagination-btn {
          padding: 14px 24px;
          border: 1px solid var(--border-light);
          background: rgba(15, 23, 42, 0.8);
          color: var(--text-primary);
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .pagination-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          color: white;
          border-color: transparent;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
        }

        .pagination-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
        }

        .pagination-info {
          text-align: center;
        }

        .page-info {
          display: block;
          font-size: 15px;
          color: var(--text-primary);
          font-weight: 600;
          margin-bottom: 6px;
        }

        .total-info {
          font-size: 13px;
          color: var(--text-tertiary);
          font-weight: 500;
        }

        /* Analytics Section */
        .analytics-section {
          position: sticky;
          top: 24px;
        }

        .chart-container {
          height: 280px;
          margin-bottom: 20px;
        }

        .chart-legend {
          display: flex;
          justify-content: center;
          gap: 20px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .legend-color {
          width: 16px;
          height: 4px;
          border-radius: 2px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
        }

        /* Loading State */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
          color: var(--text-secondary);
          font-weight: 600;
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid var(--border-light);
          border-top: 3px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.05); opacity: 0.7; }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .history-container {
            padding: 16px;
          }

          .header-title {
            font-size: 28px;
          }

          .filters-section {
            padding: 24px;
          }

          .filters-grid {
            grid-template-columns: 1fr;
          }

          .transaction-main {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .transaction-amount-section {
            text-align: left;
            width: 100%;
          }

          .pagination {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .transaction-card {
            padding: 20px;
          }

          .transaction-icon {
            width: 48px;
            height: 48px;
            font-size: 20px;
          }
        }

        @media (max-width: 480px) {
          .header-title {
            font-size: 24px;
          }

          .header-subtitle {
            font-size: 16px;
          }

          .filters-section {
            padding: 20px;
          }

          .transactions-section,
          .analytics-section {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default History;