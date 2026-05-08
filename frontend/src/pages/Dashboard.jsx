import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Plus, Clock, CheckCircle2, AlertCircle, Circle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [currentTab, setCurrentTab] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  
  // Modals state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  
  // Forms state
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskStatus, setTaskStatus] = useState('Pending');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskProject, setTaskProject] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('');

  // Filters state
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const tasksRes = await api.get('/tasks');
      const projectsRes = await api.get('/projects');
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', { title: projectTitle, description: projectDesc });
      setShowProjectModal(false);
      setProjectTitle('');
      setProjectDesc('');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating project');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', {
        title: taskTitle,
        description: taskDesc,
        status: taskStatus,
        dueDate: taskDueDate,
        project: taskProject,
        assignedTo: taskAssignee || user._id // simplified assignment for MVP
      });
      setShowTaskModal(false);
      setTaskTitle('');
      setTaskDesc('');
      setTaskDueDate('');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting task');
    }
  };

  // Derived state
  const isOverdue = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date() && new Date(dateString).toDateString() !== new Date().toDateString();
  };

  const filteredTasks = tasks.filter(t => filterStatus === 'All' ? true : t.status === filterStatus);
  
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Completed').length,
    pending: tasks.filter(t => t.status !== 'Completed').length,
    overdue: tasks.filter(t => isOverdue(t.dueDate) && t.status !== 'Completed').length
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      
      <div className="ml-64 flex-1 p-8">
        {/* Header & Stats */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-6 capitalize">{currentTab} Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Total Tasks</p>
                <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg"><Circle className="w-6 h-6 text-blue-600" /></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Completed</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.completed}</p>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg"><CheckCircle2 className="w-6 h-6 text-emerald-600" /></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Pending</p>
                <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg"><Clock className="w-6 h-6 text-amber-600" /></div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Overdue</p>
                <p className="text-3xl font-bold text-rose-600">{stats.overdue}</p>
              </div>
              <div className="bg-rose-50 p-3 rounded-lg"><AlertCircle className="w-6 h-6 text-rose-600" /></div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-semibold text-slate-800">
                {currentTab === 'tasks' ? 'Task List' : 'Projects List'}
              </h3>
              {currentTab === 'tasks' && (
                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              )}
            </div>
            
            {user?.role === 'Admin' && (
              <button 
                onClick={() => currentTab === 'tasks' ? setShowTaskModal(true) : setShowProjectModal(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
              >
                <Plus className="w-4 h-4" />
                Create {currentTab === 'tasks' ? 'Task' : 'Project'}
              </button>
            )}
          </div>

          {currentTab === 'tasks' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Task Name</th>
                    <th className="px-6 py-4">Project</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-8 text-slate-500">No tasks found.</td></tr>
                  ) : filteredTasks.map(task => (
                    <tr key={task._id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {task.title}
                        {isOverdue(task.dueDate) && task.status !== 'Completed' && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800">
                            Overdue
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">{task.project?.title || '-'}</td>
                      <td className="px-6 py-4">
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusChange(task._id, e.target.value)}
                          disabled={user.role !== 'Admin' && task.assignedTo?._id !== user._id}
                          className={`text-xs font-semibold rounded-full px-3 py-1 outline-none appearance-none cursor-pointer
                            ${task.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 
                              task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 
                              'bg-amber-100 text-amber-800'}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {user.role === 'Admin' && (
                          <button onClick={() => handleDeleteTask(task._id)} className="text-rose-600 hover:underline">
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.length === 0 ? (
                <p className="col-span-full text-center py-8 text-slate-500">No projects found.</p>
              ) : projects.map(proj => (
                <div key={proj._id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-lg text-slate-800 mb-2">{proj.title}</h4>
                  <p className="text-sm text-slate-600 line-clamp-3 mb-4">{proj.description}</p>
                  <div className="text-xs text-slate-500 pt-4 border-t border-slate-100">
                    Created by: {proj.createdBy?.name || 'Unknown'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h3 className="text-xl font-bold mb-4">Create New Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input required type="text" className="w-full border rounded-lg p-2" value={taskTitle} onChange={e => setTaskTitle(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Project</label>
                <select required className="w-full border rounded-lg p-2" value={taskProject} onChange={e => setTaskProject(e.target.value)}>
                  <option value="">Select a project...</option>
                  {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input type="date" className="w-full border rounded-lg p-2" value={taskDueDate} onChange={e => setTaskDueDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea className="w-full border rounded-lg p-2" rows="3" value={taskDesc} onChange={e => setTaskDesc(e.target.value)}></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowTaskModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h3 className="text-xl font-bold mb-4">Create New Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input required type="text" className="w-full border rounded-lg p-2" value={projectTitle} onChange={e => setProjectTitle(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea className="w-full border rounded-lg p-2" rows="3" value={projectDesc} onChange={e => setProjectDesc(e.target.value)}></textarea>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowProjectModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
