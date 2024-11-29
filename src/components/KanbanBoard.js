import React, { useState } from "react";
import "../styles/kanbanBoard.css";
import "../styles/TicketCard.css"
import GroupSelector from "./GroupSelector";

// Group categories and their values
const groupingCategories = {
  status: ["Todo", "Backlog", "In Progress", "Done", "Canceled"],
  priority: ["Urgent", "High", "Medium", "Low", "No Priority"],
  user: [] // User names will be dynamically populated
};

// Inline SVGs for status and priority icons
const icons = {
  status: {
    todo: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z"
          stroke="#B8B8B8"
          strokeWidth="2"
        />
      </svg>
    ),
    backlog: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z"
          stroke="#95999F"
          strokeWidth="2"
          strokeDasharray="1.4 1.74"
        />
      </svg>
    ),
    "in progress": (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z"
          fill="white"
          stroke="#F2BE00"
          strokeWidth="2"
        />
        <path
          d="M9 7C9 5.89543 8.10457 5 7 5C5.89543 5 5 5.89543 5 7C5 8.10457 5.89543 9 7 9C8.10457 9 9 8.10457 9 7Z"
          stroke="#F2BE00"
          strokeWidth="4"
        />
      </svg>
    ),
    done: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z"
          fill="#5E6AD2"
          stroke="#5E6AD2"
          strokeWidth="2"
        />
      </svg>
    ),
    canceled: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z"
          fill="#96A3B4"
          stroke="#96A3B4"
          strokeWidth="2"
        />
      </svg>
    )
  },
  priority: {
    urgent: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 1C1.91067 1 1 1.91067 1 3V13C1 14.0893 1.91067 15 3 15H13C14.0893 15 15 14.0893 15 13V3C15 1.91067 14.0893 1 13 1H3ZM7 4H9L8.75391 8.99836H7.25L7 4ZM9 11C9 11.5523 8.55228 12 8 12C7.44772 12 7 11.5523 7 11C7 10.4477 7.44772 10 8 10C8.55228 10 9 10.4477 9 11Z"
          fill="#FB773F"
        />
      </svg>
    ),
    high: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.5 8H2.5C1.94772 8 1.5 8.44772 1.5 9V13C1.5 13.5523 1.94772 14 2.5 14H3.5C4.05228 14 4.5 13.5523 4.5 13V9C4.5 8.44772 4.05228 8 3.5 8Z"
            fill="#5C5C5E"
          />
          <path
            d="M8.5 5H7.5C6.94772 5 6.5 5.44772 6.5 6V13C6.5 13.5523 6.94772 14 7.5 14H8.5C9.05228 14 9.5 13.5523 9.5 13V6C9.5 5.44772 9.05228 5 8.5 5Z"
            fill="#5C5C5E"
          />
          <path
            d="M13.5 2H12.5C11.9477 2 11.5 2.44772 11.5 3V13C11.5 13.5523 11.9477 14 12.5 14H13.5C14.0523 14 14.5 13.5523 14.5 13V3C14.5 2.44772 14.0523 2 13.5 2Z"
            fill="#5C5C5E"
          />
        </svg>
      ),
      medium: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.5 8H2.5C1.94772 8 1.5 8.44772 1.5 9V13C1.5 13.5523 1.94772 14 2.5 14H3.5C4.05228 14 4.5 13.5523 4.5 13V9C4.5 8.44772 4.05228 8 3.5 8Z"
            fill="#5C5C5E"
          />
          <path
            d="M8.5 5H7.5C6.94772 5 6.5 5.44772 6.5 6V13C6.5 13.5523 6.94772 14 7.5 14H8.5C9.05228 14 9.5 13.5523 9.5 13V6C9.5 5.44772 9.05228 5 8.5 5Z"
            fill="#5C5C5E"
          />
          <path
            d="M13.5 2H12.5C11.9477 2 11.5 2.44772 11.5 3V13C11.5 13.5523 11.9477 14 12.5 14H13.5C14.0523 14 14.5 13.5523 14.5 13V3C14.5 2.44772 14.0523 2 13.5 2Z"
            fill="#5C5C5E"
            fillOpacity="0.4"
          />
        </svg>
      ),
      
      low: (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.5 8H2.5C1.94772 8 1.5 8.44772 1.5 9V13C1.5 13.5523 1.94772 14 2.5 14H3.5C4.05228 14 4.5 13.5523 4.5 13V9C4.5 8.44772 4.05228 8 3.5 8Z"
            fill="#5C5C5E"
          />
          <path
            d="M8.5 5H7.5C6.94772 5 6.5 5.44772 6.5 6V13C6.5 13.5523 6.94772 14 7.5 14H8.5C9.05228 14 9.5 13.5523 9.5 13V6C9.5 5.44772 9.05228 5 8.5 5Z"
            fill="#5C5C5E"
            fillOpacity="0.4"
          />
          <path
            d="M13.5 2H12.5C11.9477 2 11.5 2.44772 11.5 3V13C11.5 13.5523 11.9477 14 12.5 14H13.5C14.0523 14 14.5 13.5523 14.5 13V3C14.5 2.44772 14.0523 2 13.5 2Z"
            fill="#5C5C5E"
            fillOpacity="0.4"
          />
        </svg>
      ),
      
      "no priority": (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      opacity="0.9"
      d="M4.5 7.34375H2.75C2.50838 7.34375 2.3125 7.53963 2.3125 7.78125V8.21875C2.3125 8.46037 2.50838 8.65625 2.75 8.65625H4.5C4.74162 8.65625 4.9375 8.46037 4.9375 8.21875V7.78125C4.9375 7.53963 4.74162 7.34375 4.5 7.34375Z"
      fill="#5E5E5F"
    />
    <path
      opacity="0.9"
      d="M8.875 7.34375H7.125C6.88338 7.34375 6.6875 7.53963 6.6875 7.78125V8.21875C6.6875 8.46037 6.88338 8.65625 7.125 8.65625H8.875C9.11662 8.65625 9.3125 8.46037 9.3125 8.21875V7.78125C9.3125 7.53963 9.11662 7.34375 8.875 7.34375Z"
      fill="#5E5E5F"
    />
    <path
      opacity="0.9"
      d="M13.25 7.34375H11.5C11.2584 7.34375 11.0625 7.53963 11.0625 7.78125V8.21875C11.0625 8.46037 11.2584 8.65625 11.5 8.65625H13.25C13.4916 8.65625 13.6875 8.46037 13.6875 8.21875V7.78125C13.6875 7.53963 13.4916 7.34375 13.25 7.34375Z"
      fill="#5E5E5F"
    />
  </svg>
),

      
  }
};

// Code remains as in the previous version, now correctly displaying icons.


// Normalize group keys to ensure consistency
const normalizeGroupKey = (key) => {
  if (!key) return "Uncategorized";

  const normalizedKey = key.toLowerCase().trim();

  if (normalizedKey === "inprogress" || normalizedKey === "in progress") {
    return "In Progress";
  }

  return key;
};

// Main Kanban Board Component
const KanbanBoard = ({ tickets, users }) => {
  const [grouping, setGrouping] = useState("status");
  const [ordering, setOrdering] = useState("priority");

  // Group tickets dynamically based on grouping selection
  const groupTickets = (tickets, groupBy) => {
    const grouped = {};
  
    if (groupBy === "user") {
      // Sort user names in ascending order
      const sortedUsers = users.slice().sort((a, b) => a.name.localeCompare(b.name));
  
      // Initialize groups for each user
      sortedUsers.forEach((user) => {
        grouped[user.name] = [];
      });
  
      // Distribute tickets into user groups
      tickets.forEach((ticket) => {
        const user = users.find((u) => u.id === ticket.userId);
        if (user) {
          grouped[user.name].push(ticket);
        }
      });
    } else {
      // Default grouping logic for other categories
      const groups = groupingCategories[groupBy] || [];
      groups.forEach((group) => {
        grouped[group] = [];
      });
  
      tickets.forEach((ticket) => {
        let groupKey;
  
        if (groupBy === "priority") {
          // Map numeric priorities to readable priority names
          const priorities = {
            4: "Urgent",
            3: "High",
            2: "Medium",
            1: "Low",
            0: "No Priority"
          };
          groupKey = priorities[ticket.priority] || "No Priority";
        } else {
          groupKey = ticket.status || "Uncategorized";
        }
  
        groupKey = normalizeGroupKey(groupKey);
  
        if (!grouped[groupKey]) grouped[groupKey] = [];
        grouped[groupKey].push(ticket);
      });
    }
  
    return grouped;
  };
  
  

  // Order tickets within each group
  const orderTickets = (tickets, orderBy) => {
    return tickets.sort((a, b) => {
      if (orderBy === "priority") {
        return (b.priority || 0) - (a.priority || 0); // Descending priority
      }
      return a.title.localeCompare(b.title); // Ascending title
    });
  };

  // Group and order tickets
  const groupedTickets = groupTickets(tickets, grouping);

  return (
    <div className="kanban-board">
      <h1>Kanban Board</h1>
      <div className="controls">
        <GroupSelector grouping={grouping} setGrouping={setGrouping} />
        <label htmlFor="ordering">Ordering:</label>
        <select value={ordering} onChange={(e) => setOrdering(e.target.value)}>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>
      <div className="kanban-columns">
        {Object.entries(groupedTickets).map(([groupKey, tickets]) => (
          <div key={groupKey} className="kanban-column">
            <div className="column-header">
  <div className="icon">
    {icons[grouping === "priority" ? "priority" : "status"][
      groupKey.toLowerCase()
    ] || null}
  </div>
  <h2>{groupKey}</h2>
  <span>({tickets.length})</span>
  <div className="column-icons">
    {/* Add the SVGs here */}
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.75 4C8.75 3.58579 8.41421 3.25 8 3.25C7.58579 3.25 7.25 3.58579 7.25 4V7.25H4C3.58579 7.25 3.25 7.58579 3.25 8C3.25 8.41421 3.58579 8.75 4 8.75H7.25V12C7.25 12.4142 7.58579 12.75 8 12.75C8.41421 12.75 8.75 12.4142 8.75 12V8.75H12C12.4142 8.75 12.75 8.41421 12.75 8C12.75 7.58579 12.4142 7.25 12 7.25H8.75V4Z"
        fill="#5C5C5E"
      />
    </svg>
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 6.5C3.39782 6.5 3.77936 6.65804 4.06066 6.93934C4.34196 7.22064 4.5 7.60218 4.5 8C4.5 8.39782 4.34196 8.77936 4.06066 9.06066C3.77936 9.34196 3.39782 9.5 3 9.5C2.60218 9.5 2.22064 9.34196 1.93934 9.06066C1.65804 8.77936 1.5 8.39782 1.5 8C1.5 7.60218 1.65804 7.22064 1.93934 6.93934C2.22064 6.65804 2.60218 6.5 3 6.5ZM8 6.5C8.39782 6.5 8.77936 6.65804 9.06066 6.93934C9.34196 7.22064 9.5 7.60218 9.5 8C9.5 8.39782 9.34196 8.77936 9.06066 9.06066C8.77936 9.34196 8.39782 9.5 8 9.5C7.60218 9.5 7.22064 9.34196 6.93934 9.06066C6.65804 8.77936 6.5 8.39782 6.5 8C6.5 7.60218 6.65804 7.22064 6.93934 6.93934C7.22064 6.65804 7.60218 6.5 8 6.5ZM13 6.5C13.3978 6.5 13.7794 6.65804 14.0607 6.93934C14.342 7.22064 14.5 7.60218 14.5 8C14.5 8.39782 14.342 8.77936 14.0607 9.06066C13.7794 9.34196 13.3978 9.5 13 9.5C12.6022 9.5 12.2206 9.34196 11.9393 9.06066C11.658 8.77936 11.5 8.39782 11.5 8C11.5 7.60218 11.658 7.22064 11.9393 6.93934C12.2206 6.65804 12.6022 6.5 13 6.5Z"
        fill="#5C5C5E"
      />
    </svg>
  </div>
</div>

            {orderTickets(tickets, ordering).map((ticket) => (
              <div key={ticket.id} className="ticket-card">
              <p className="ticket-id">{ticket.id}</p> {/* Ticket ID in light gray */}
              <p className="ticket-title">{ticket.title}</p> {/* Ticket title in bold */}
              <div className="tags-container">
                <div className="priority-icon">
                  {icons.priority[
                    ticket.priority
                      ? {
                          4: "urgent",
                          3: "high",
                          2: "medium",
                          1: "low",
                          0: "no priority"
                        }[ticket.priority]
                      : "no priority"
                  ]}
                </div>
                <span className="priority-text">
                  Priority:{" "}
                  {ticket.priority
                    ? {
                        4: "Urgent",
                        3: "High",
                        2: "Medium",
                        1: "Low",
                        0: "No Priority"
                      }[ticket.priority]
                    : "No Priority"}
                </span>
              </div>
            </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
