import React, { useState, useEffect } from "react";

const DAYS = 7;

// Define your routines here (with colors & emojis)
const ROUTINE_INFO = [
  { id: "1", color: "#3b82f6", name: "Shampoo", emoji: "🧑" },
  { id: "2", color: "#8b5cf6", name: "Retinol", emoji: "✨" },
  { id: "3", color: "#10b981", name: "Exfoliating Cleanser", emoji: "🧼" },
  { id: "4", color: "#f59e0b", name: "Body Lotion", emoji: "🧴" },
];

const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

const RoutineTracker = () => {
  // Load data from localStorage or initialize
  const [routines, setRoutines] = useState(() => {
    try {
      const saved = localStorage.getItem("routineTrackerDataFinal");
      if (saved) return JSON.parse(saved);

      // Build a clean default object
      const initial = {};
      ROUTINE_INFO.forEach((r) => {
        initial[r.id] = Array(DAYS).fill(false);
      });
      return initial;
    } catch {
      const fallback = {};
      ROUTINE_INFO.forEach((r) => {
        fallback[r.id] = Array(DAYS).fill(false);
      });
      return fallback;
    }
  });

  const [lastShiftDate, setLastShiftDate] = useState(() => {
    return localStorage.getItem("lastShiftDate") || new Date().toDateString();
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("routineTrackerDataFinal", JSON.stringify(routines));
  }, [routines]);

  useEffect(() => {
    localStorage.setItem("lastShiftDate", lastShiftDate);
  }, [lastShiftDate]);

  // Shift days at midnight
  useEffect(() => {
    const now = new Date();
    if (lastShiftDate !== now.toDateString()) {
      shiftDays();
      setLastShiftDate(now.toDateString());
    }

    const checkMidnight = setInterval(() => {
      const today = new Date();
      if (lastShiftDate !== today.toDateString()) {
        shiftDays();
        setLastShiftDate(today.toDateString());
      }
    }, 60000);

    return () => clearInterval(checkMidnight);
  }, [lastShiftDate]);

  // Add this after you define setRoutines
  useEffect(() => {
    window.testShift = () => {
      setRoutines(prev => {
        const shifted = {};
        for (const [id, arr] of Object.entries(prev)) {
          shifted[id] = [...arr.slice(1), false]; // shift left, add false
        }
        console.log("Shifted!", shifted);
        return shifted;
      });
    };
  }, [setRoutines]);

  const shiftDays = () => {
    setRoutines((prev) => {
      const shifted = {};
      Object.entries(prev).forEach(([id, arr]) => {
        shifted[id] = [...arr.slice(1), false];
      });
      return shifted;
    });
  };

  const toggleCompleted = (routineId, index) => {
    setRoutines((prev) => {
      const updated = { ...prev };
      updated[routineId] = [...updated[routineId]];
      updated[routineId][index] = !updated[routineId][index];
      return updated;
    });
  };

  // Build headers: oldest to newest
  const today = new Date();
  const headers = [...Array(DAYS)].map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (DAYS - 1 - i));
    return {
      label: dayLabels[d.getDay()],
      date: d.getDate(),
      isToday: i === DAYS - 1,
    };
  });

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        padding: "10px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
        Routine Tracker
      </h1>

      {/* Day headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${DAYS}, 1fr)`,
          // gap: "7px",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        {headers.map((h, i) => (
          <div key={i}>
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "5px" }}>
              {h.label}
            </div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                padding: "5px",
                borderRadius: "5px",
                backgroundColor: h.isToday ? "#e3f2fd" : "transparent",
                color: h.isToday ? "#1976d2" : "#333",
              }}
            >
              {h.date}
            </div>
          </div>
        ))}
      </div>

      {/* Routine rows */}
      {ROUTINE_INFO.map((routine) => (
        <div key={routine.id} style={{ marginBottom: "25px" }}>
          <div
            style={{
              display: "inline-block",
              padding: "5px 12px",
              backgroundColor: routine.color + "20",
              color: routine.color,
              borderRadius: "20px",
              fontWeight: "600",
              fontSize: "16px",
              marginBottom: "10px",
            }}
          >
            {routine.emoji} {routine.name} {routine.emoji}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${DAYS}, 1fr)`,
              gap: "10px",
              marginBottom: "10px",
              padding: "15px",
              borderRadius: "10px",
              backgroundColor: routine.color + "10",
            }}
          >
            {routines[routine.id].map((done, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "center" }}>
                <button
                  onClick={() => toggleCompleted(routine.id, i)}
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    border: "2px solid #ddd",
                    backgroundColor: done ? routine.color : "white",
                    color: done ? "white" : "#666",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  {done ? "✓" : ""}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoutineTracker;
