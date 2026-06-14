import React from "react";

const SectionTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="app-card mb-6 overflow-x-auto border-none bg-white/70 p-2">
      <div className="flex min-w-max items-center gap-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition sm:text-base ${
              isActive
                ? "bg-blue12 text-white shadow"
                : "bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
      </div>
    </div>
  );
};

export default SectionTabs;
