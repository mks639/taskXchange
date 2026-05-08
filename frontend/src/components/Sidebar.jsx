import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, CheckSquare, FolderKanban, LogOut } from 'lucide-react';

const Sidebar = ({ currentTab, setCurrentTab }) => {
  const { user, logout } = useContext(AuthContext);

  const tabs = [
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-5 h-5" /> },
    { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-5 h-5" /> }
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed top-0 left-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <LayoutDashboard className="text-indigo-400" />
          TaskXChange
        </h1>
      </div>
      
      <div className="px-4 pb-4">
        <div className="bg-slate-800 p-4 rounded-lg mb-6">
          <p className="text-sm text-slate-400">Logged in as:</p>
          <p className="font-medium truncate">{user?.name}</p>
          <span className="inline-block mt-2 px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-full">
            {user?.role}
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${currentTab === tab.id ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
