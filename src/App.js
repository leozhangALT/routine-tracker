import React, { useState, useEffect } from 'react';

const RoutineTracker = () => {
  // ✅ Initialize state directly from localStorage
  const [completedDates, setCompletedDates] = useState(() => {
    try {
      const saved = localStorage.getItem('routineTrackerData');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error('Error parsing localStorage data', e);
      return {};
    }
  });

  const routines = [
    { id: 1, color: '#3b82f6', name: 'Shampoo', emoji: '🧑' },
    { id: 2, color: '#8b5cf6', name: 'Retinol', emoji: '✨' },
    { id: 3, color: '#10b981', name: 'Exfoliating Cleanser', emoji: '🧼' },
    { id: 4, color: '#f59e0b', name: 'Body Lotion', emoji: '🧴' }
  ];

  const today = new Date();
  const weekDays = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    weekDays.push(day);
  }

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const formatDateKey = (date) => date.toISOString().split('T')[0];

  const isCompleted = (routineId, date) => {
    const dateKey = formatDateKey(date);
    return completedDates[routineId]?.includes(dateKey) || false;
  };

  const toggleCompleted = (routineId, date) => {
    const dateKey = formatDateKey(date);
    setCompletedDates(prev => {
      const routineDates = prev[routineId] || [];
      if (routineDates.includes(dateKey)) {
        return {
          ...prev,
          [routineId]: routineDates.filter(d => d !== dateKey)
        };
      } else {
        return {
          ...prev,
          [routineId]: [...routineDates, dateKey]
        };
      }
    });
  };

  const isToday = (date) => formatDateKey(date) === formatDateKey(today);

  // ✅ Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('routineTrackerData', JSON.stringify(completedDates));
  }, [completedDates]);

  return (
    <div style={{
      maxWidth: '400px',
      margin: '0 auto',
      padding: '10px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        Routine Tracker
      </h1>

      {/* Day headers */}
      <div style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '7px',
          marginBottom: '20px'
        }}>
          {weekDays.map((date, i) => (
            <div key={i} style={{
              textAlign: 'center',
              padding: '10px 5px'
            }}>
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                {dayLabels[date.getDay()]}
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                padding: '5px',
                borderRadius: '5px',
                backgroundColor: isToday(date) ? '#e3f2fd' : 'transparent',
                color: isToday(date) ? '#1976d2' : '#333'
              }}>
                {date.getDate()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Routine rows */}
      {routines.map(routine => (
        <div key={routine.id} style={{ marginBottom: '25px' }}>
          <div style={{
            display: 'inline-block',
            padding: '5px 12px',
            backgroundColor: routine.color + '20',
            color: routine.color,
            borderRadius: '20px',
            fontWeight: '600',
            fontSize: '16px',
            marginBottom: '10px'
          }}>
            {routine.emoji + ' ' + routine.name + ' ' + routine.emoji}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '10px',
            marginBottom: '10px',
            padding: '15px',
            borderRadius: '10px',
            backgroundColor: routine.color + '10'
          }}>
            {weekDays.map((date, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={() => toggleCompleted(routine.id, date)}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    border: '2px solid #ddd',
                    backgroundColor: isCompleted(routine.id, date) ? routine.color : 'white',
                    color: isCompleted(routine.id, date) ? 'white' : '#666',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  {isCompleted(routine.id, date) ? '✓' : ''}
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
