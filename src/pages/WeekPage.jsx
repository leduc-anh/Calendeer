import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasks, fetchTaskbyId } from '../features/taskSlice';
import _ from 'lodash';
import TaskModal from '../components/TaskModal';
import TaskCreateEditModal from '../components/TaskCreateEditModal';
import styles from './WeekPage.module.scss';

export default function WeekPage() {
  const dispatch = useDispatch();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const tasks = useSelector((state) => state.tasks.items);
  const selectedTask = useSelector((state) => state.tasks.selectedTask);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);
  
  const getStartOfWeek = useCallback((date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }, []);
  const weekDays = useMemo(() => {
    const start = getStartOfWeek(currentWeek);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  }, [currentWeek, getStartOfWeek]);

  const timeSlots = useMemo(() => Array.from({ length: 24 }, (_, i) => i), []);

  const goToPreviousWeek = useCallback(() => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() - 7);
    setCurrentWeek(newDate);
  }, [currentWeek]);

  const goToNextWeek = useCallback(() => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + 7);
    setCurrentWeek(newDate);
  }, [currentWeek]);
  
  const goToToday = useCallback(() => {
    setCurrentWeek(new Date());
  }, []);

  const formatDate = useCallback((date) => {
    return date.toISOString().split('T')[0];
  }, []);

  const getTasksForSlot = useCallback((day, hour) => {
    const dayStr = formatDate(day);
    return _.filter(tasks, (task) => {
      if (!task.startTime) return false;
      const taskDate = formatDate(new Date(task.startTime));
      if (taskDate !== dayStr) return false;

      const taskStart = new Date(task.startTime);
      const taskEnd = task.endTime ? new Date(task.endTime) : taskStart;
      const taskStartHour = taskStart.getHours();
      const taskEndHour = taskEnd.getHours();
      
      return hour >= taskStartHour && hour < taskEndHour;
    });
  }, [tasks, formatDate]);
  
  const getTaskDuration = useCallback((task) => {
    if (!task.startTime || !task.endTime) return 1;
    const start = new Date(task.startTime);
    const end = new Date(task.endTime);
    const hours = (end - start) / (1000 * 60 * 60);
    return Math.max(1, Math.ceil(hours));
  }, []);

  const isFirstHourOfTask = useCallback((task, hour) => {
    if (!task.startTime) return true;
    const taskStart = new Date(task.startTime);
    return taskStart.getHours() === hour;
  }, []);

  const isToday = useCallback((date) => {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  }, [formatDate]);

  const handleCellClick = useCallback((day, hour) => {
    const selectedDateTime = new Date(day);
    selectedDateTime.setHours(hour, 0, 0, 0);
    setSelectedDate(selectedDateTime);
    setSelectedTime(hour);
    setIsCreateModalOpen(true);
  }, []);

  const handleTaskClick = useCallback((e, taskId) => {
    e.stopPropagation();
    dispatch(fetchTaskbyId(taskId));
  }, [dispatch]);
  
  const formatTime = useCallback((hour) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  }, []);

  const formatHeaderDate = useCallback((date) => {
    const options = { day: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-US', options);
  }, []);

  const dayNames = useMemo(() => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], []);
  const getTaskColor = useCallback((status) => {
    switch (status) {
      case 'Todo':
        return 'blue';
      case 'InProgress':
        return 'beige';
      case 'Review':
        return 'purple';
      case 'Done':
        return 'pink';
      default:
        return 'gray';
    }
  }, []);

  return (
    <div className={styles['week-page']}>
      <div className={styles['week-header']}>
        <div className={styles['week-navigation']}>
          <button onClick={goToPreviousWeek} className={styles['nav-button']}>
            ← Previous
          </button>
          <button onClick={goToToday} className={styles['today-button']}>
            Today
          </button>
          <button onClick={goToNextWeek} className={styles['nav-button']}>
            Next →
          </button>
        </div>
        <div className={styles['week-title']}>
          Week of {formatHeaderDate(weekDays[0])} - {formatHeaderDate(weekDays[6])}, {currentWeek.getFullYear()}
        </div>
      </div>

      <div className={styles['week-calendar']}>
        <div className={styles['calendar-header']}>
          <div className={styles['time-column-header']}>Time</div>
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={`${styles['day-header']} ${isToday(day) ? styles.today : ''}`}
            >
              <div className={styles['day-name']}>{dayNames[index]}</div>
              <div className={styles['day-date']}>{formatHeaderDate(day)}</div>
            </div>
          ))}
        </div>

        <div className={styles['calendar-body']}>
          <div className={styles['time-column']}>
            {timeSlots.map((hour) => (
              <div key={hour} className={styles['time-slot']}>
                {formatTime(hour)}
              </div>
            ))}
          </div>

          <div className={styles['days-grid']}>
            {weekDays.map((day, dayIndex) => (
              <div key={dayIndex} className={`${styles['day-column']} ${isToday(day) ? styles.today : ''}`}>
                {timeSlots.map((hour) => {
                  const tasksInSlot = getTasksForSlot(day, hour);
                  return (
                    <div
                      key={hour}
                      className={styles['time-cell']}
                      onClick={() => handleCellClick(day, hour)}
                    >
                      {tasksInSlot.filter(task => isFirstHourOfTask(task, hour)).map((task) => {
                        const duration = getTaskDuration(task);
                        return (
                          <div
                            key={task.id}
                            
                            className={`${styles['task-block']} ${styles[getTaskColor(task.status)]}`}
                            style={{ height: `calc(${duration * 40}px - 0.2rem)` }}
                            onClick={(e) => handleTaskClick(e, task.id)}
                          >
                            <div className={styles['task-title']}>{task.name || task.title}</div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {isCreateModalOpen && (
        <TaskCreateEditModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          initialDate={selectedDate}
          isCreateMode={true}
        />
      )}

      {selectedTask && <TaskModal task={selectedTask} loading={false} isOpen={true} />}
    </div>
  );
}
