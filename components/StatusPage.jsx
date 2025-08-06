/*
 * Lokasi: components/StatusPage.jsx
 * Versi: v4
 */

import StatusPageSkeleton from './StatusPageSkeleton';

export default function StatusPage({ data, isLoading, error }) {
  if (isLoading) {
    return <StatusPageSkeleton />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!data) {
    return (
      <div className="status-page-container">
        <header className="status-header">
          <h1>API Status</h1>
          <p>Data not available.</p>
        </header>
      </div>
    );
  }

  const { statistics, psp } = data;

  const getStatusClass = (status) => {
    switch(status) {
      case 'success': return 'up';
      case 'danger': return 'down';
      default: return 'paused';
    }
  };

  return (
    <div className="status-page-container">
      <header className="status-header">
        <h1>API Status</h1>
        {statistics && (
          <div className={`status-summary status-summary-${getStatusClass(statistics.uptime.l1.label)}`}>
            {statistics.count_result}
          </div>
        )}
      </header>

      <main className="monitor-list">
        {psp && psp.monitors.map((monitor, index) => (
          <div key={monitor.monitorId} className="monitor-item" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="monitor-header">
              <span className={`status-indicator ${getStatusClass(monitor.statusClass)}`}></span>
              <span className="monitor-name">{monitor.name}</span>
            </div>
            <div className="daily-ratio-bars">
              {monitor.dailyRatios.slice(0, 60).map((day, dayIndex) => (
                <div 
                  key={dayIndex} 
                  className={`ratio-bar ${parseFloat(day.ratio) < 100 ? 'partial' : ''}`}
                  title={`Day ${dayIndex + 1}: ${day.ratio}%`}
                ></div>
              ))}
            </div>
            <div className="uptime-stats">
              <div><span>Today</span><strong>{parseFloat(monitor.dailyRatios[0].ratio).toFixed(2)}%</strong></div>
              <div><span>30 Days</span><strong>{parseFloat(monitor['30dRatio'].ratio).toFixed(2)}%</strong></div>
              <div><span>90 Days</span><strong>{parseFloat(monitor['90dRatio'].ratio).toFixed(2)}%</strong></div>
            </div>
          </div>
        ))}
      </main>

      <footer className="status-footer">
        <p>Powered by UptimeRobot.</p>
      </footer>
    </div>
  );
}