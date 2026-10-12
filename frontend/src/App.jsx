import { useEffect, useRef, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const formRef = useRef(null);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Pending");
  const [editingId, setEditingId] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !subject) {
      alert("Please enter title and subject");
      return;
    }

    const taskData = {
      title,
      subject,
      priority,
      status,
    };

    try {
      if (editingId) {
        await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        });
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskData),
        });
      }

      clearForm();
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const editTask = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setSubject(task.subject);
    setPriority(task.priority);
    setStatus(task.status);
    setTimeout(() => {
  formRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}, 100);
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const clearForm = () => {
    setEditingId(null);
    setTitle("");
    setSubject("");
    setPriority("Medium");
    setStatus("Pending");
  };

  // Search + status filter
  const completedTasks = tasks.filter(
  (task) => task.status === "Completed"
).length;

const progress =
  tasks.length === 0
    ? 0
    : Math.round((completedTasks / tasks.length) * 100);
  const filteredTasks = tasks.filter((task) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      task.title.toLowerCase().includes(searchText) ||
      task.subject.toLowerCase().includes(searchText);

    const matchesStatus =
      filterStatus === "All" || task.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="app">
      <header>
        <h1>Personal Study & Productivity Manager</h1>
        <p>Organize your studies. Track your progress.</p>
      </header>

      <main>
        {/* Add / Edit Task */}
        <section className="task-form">
          <h2>{editingId ? "Edit Task" : "Add New Task"}</h2>

          <form ref={formRef} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <button type="submit">
              {editingId ? "Update Task" : "Add Task"}
            </button>

            {editingId && (
              <button type="button" onClick={clearForm}>
                Cancel Edit
              </button>
            )}
          </form>
        </section>

        {/* Dashboard */}
        <section className="dashboard">
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <p>{tasks.length}</p>
          </div>

          <div className="stat-card">
            <h3>Pending</h3>
            <p>
              {tasks.filter((task) => task.status === "Pending").length}
            </p>
          </div>

          <div className="stat-card">
            <h3>In Progress</h3>
            <p>
              {tasks.filter((task) => task.status === "In Progress").length}
            </p>
          </div>

          <div className="stat-card">
            <h3>Completed</h3>
            <p>
              {tasks.filter((task) => task.status === "Completed").length}
            </p>
          </div>
        </section>

        {/* Task List */}
        <section className="progress-section">
  <div className="progress-header">
    <h2>Overall Progress</h2>
    <strong>{progress}%</strong>
  </div>

  <div className="progress-bar">
    <div
      className="progress-fill"
      style={{ width: `${progress}%` }}
    ></div>
  </div>

  <p>
    {completedTasks} of {tasks.length} tasks completed
  </p>
</section>
        <section className="task-list">
          <h2>My Tasks</h2>
          <p className="task-count">
  Showing {filteredTasks.length} of {tasks.length} tasks
</p>

          {/* Search */}
          <input
            type="text"
            placeholder="Search tasks or subjects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-box"
          />
          {search && (
  <button
    type="button"
    className="clear-search-btn"
    onClick={() => setSearch("")}
  >
    Clear Search
  </button>
)}

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-box"
          >
            <option value="All">All Tasks</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {filteredTasks.length === 0 ? (
            <p>No tasks found.</p>
          ) : (
            filteredTasks.map((task) => (
              <div className="task-card" key={task.id}>
                <div>
                  <h3>{task.title}</h3>

                  <p>Subject: {task.subject}</p>

                  <p>
                    Priority:
                    <span
                      className={`priority ${task.priority.toLowerCase()}`}
                    >
                      {task.priority}
                    </span>
                  </p>

                  <p>
                    Status:
                    <span
                      className={`status ${task.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {task.status}
                    </span>
                  </p>
                </div>

                <div>
                  <button
                    className="edit-btn"
                    onClick={() => editTask(task)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default App;