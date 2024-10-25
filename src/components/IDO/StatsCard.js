import React from "react";

export default function StatsCard({ idoData, userData }) {
  return (
    <div>
      <div className="stats-card">
        <div className="stats-header">Pool Information</div>

        <div className="stats-table">
          <div className="stats-row">
            <span className="stats-label">IDO Open for All</span>
            <span className="stats-value">{idoData?.sale_open_for_everyone === 1 ? 'true' : 'false'}</span>
          </div>
          <div className="stats-row">
            <span className="stats-label">Total Investment</span>
            <span className="stats-value">{idoData?.total_investment}</span>
          </div>
          <div className="stats-row">
            <span className="stats-label">User Whitelisted</span>
            <span className="stats-value">{userData?.is_glean_whitelisted === 1 ? "true" : "false"}</span>
          </div>
          <div className="stats-row">
            <span className="stats-label">Your Investment</span>
            <span className="stats-value">{userData?.investment_amount}</span>
          </div>
          <div className="stats-row">
            <span className="stats-label">IDO paused</span>
            <span className="stats-value">{idoData?.paused === 1 ? "true" : "false"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
