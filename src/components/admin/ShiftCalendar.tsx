// Advanced calendar component for shift visualization and assignment

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  User, 
  MapPin,
  Plus,
  Filter,
  Eye,
  UserCheck,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface CalendarShift {
  id: string;
  title: string;
  participant: string;
  worker?: string;
  startTime: string;
  endTime: string;
  status: 'pending_assignment' | 'assigned' | 'confirmed' | 'completed' | 'cancelled';
  location: string;
  serviceType: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  riskLevel: 'low' | 'medium' | 'high';
  estimatedCost: number;
}

interface ShiftCalendarProps {
  shifts: CalendarShift[];
  onShiftClick: (shift: CalendarShift) => void;
  onDateClick: (date: Date) => void;
  onAssignShift?: (shiftId: string) => void;
  viewMode: 'month' | 'week' | 'day';
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const ShiftCalendar: React.FC<ShiftCalendarProps> = ({
  shifts,
  onShiftClick,
  onDateClick,
  onAssignShift,
  viewMode,
  selectedDate,
  onDateChange
}) => {
  const [currentDate, setCurrentDate] = useState(selectedDate);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterUrgency, setFilterUrgency] = useState('all');

  useEffect(() => {
    setCurrentDate(selectedDate);
  }, [selectedDate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_assignment':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'assigned':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'completed':
        return 'bg-gray-100 border-gray-300 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getUrgencyIndicator = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'border-l-4 border-l-red-500';
      case 'high':
        return 'border-l-4 border-l-orange-500';
      case 'medium':
        return 'border-l-4 border-l-yellow-500';
      case 'low':
        return 'border-l-4 border-l-green-500';
      default:
        return '';
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (viewMode) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    setCurrentDate(newDate);
    onDateChange(newDate);
  };

  const getDateRange = () => {
    switch (viewMode) {
      case 'month':
        return currentDate.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });
      case 'week':
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - currentDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${weekStart.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })}`;
      case 'day':
        return currentDate.toLocaleDateString('en-AU', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    }
  };

  const filteredShifts = shifts.filter(shift => {
    const matchesStatus = filterStatus === 'all' || shift.status === filterStatus;
    const matchesUrgency = filterUrgency === 'all' || shift.urgency === filterUrgency;
    return matchesStatus && matchesUrgency;
  });

  const getShiftsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredShifts.filter(shift => {
      // For demo purposes, distribute shifts across dates
      const shiftDate = new Date(2025, 0, 15 + parseInt(shift.id.slice(-1)));
      return shiftDate.toISOString().split('T')[0] === dateStr;
    });
  };

  const renderMonthView = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDateForLoop = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayShifts = getShiftsForDate(currentDateForLoop);
      const isCurrentMonth = currentDateForLoop.getMonth() === currentDate.getMonth();
      const isToday = currentDateForLoop.toDateString() === new Date().toDateString();
      
      days.push(
        <div
          key={currentDateForLoop.toISOString()}
          className={`min-h-[120px] border border-gray-200 p-2 cursor-pointer hover:bg-gray-50 ${
            !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
          } ${isToday ? 'bg-blue-50 border-blue-300' : ''}`}
          onClick={() => onDateClick(new Date(currentDateForLoop))}
        >
          <div className="font-medium text-sm mb-2">
            {currentDateForLoop.getDate()}
          </div>
          <div className="space-y-1">
            {dayShifts.slice(0, 3).map(shift => (
              <div
                key={shift.id}
                className={`text-xs p-1 rounded border cursor-pointer ${getStatusColor(shift.status)} ${getUrgencyIndicator(shift.urgency)}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onShiftClick(shift);
                }}
              >
                <div className="font-medium truncate">{shift.title}</div>
                <div className="truncate">{shift.startTime} - {shift.participant}</div>
              </div>
            ))}
            {dayShifts.length > 3 && (
              <div className="text-xs text-gray-500">
                +{dayShifts.length - 3} more
              </div>
            )}
          </div>
        </div>
      );
      
      currentDateForLoop.setDate(currentDateForLoop.getDate() + 1);
    }
    
    return (
      <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-gray-100 p-3 text-center font-medium text-sm text-gray-700 border-b border-gray-200">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - currentDate.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      const dayShifts = getShiftsForDate(day);
      
      days.push(
        <div key={day.toISOString()} className="border-r border-gray-200 last:border-r-0">
          <div className="bg-gray-50 p-3 text-center border-b border-gray-200">
            <div className="font-medium text-sm">{day.toLocaleDateString('en-AU', { weekday: 'short' })}</div>
            <div className="text-lg font-bold">{day.getDate()}</div>
          </div>
          <div className="p-2 space-y-2 min-h-[400px]">
            {dayShifts.map(shift => (
              <div
                key={shift.id}
                className={`p-2 rounded border cursor-pointer ${getStatusColor(shift.status)} ${getUrgencyIndicator(shift.urgency)}`}
                onClick={() => onShiftClick(shift)}
              >
                <div className="font-medium text-sm">{shift.title}</div>
                <div className="text-xs">{shift.startTime} - {shift.endTime}</div>
                <div className="text-xs truncate">{shift.participant}</div>
                {shift.worker && (
                  <div className="text-xs text-gray-600">Worker: {shift.worker}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-7 border border-gray-200 rounded-lg overflow-hidden">
        {days}
      </div>
    );
  };

  const renderDayView = () => {
    const dayShifts = getShiftsForDate(currentDate);
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-50 p-4 border-b border-gray-200">
          <h3 className="font-medium text-lg">
            {currentDate.toLocaleDateString('en-AU', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>
        </div>
        <div className="max-h-[600px] overflow-y-auto">
          {hours.map(hour => (
            <div key={hour} className="border-b border-gray-100 last:border-b-0">
              <div className="flex">
                <div className="w-16 p-2 bg-gray-50 border-r border-gray-200 text-sm text-gray-600">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                <div className="flex-1 p-2 min-h-[60px]">
                  {dayShifts
                    .filter(shift => {
                      const shiftHour = parseInt(shift.startTime.split(':')[0]);
                      return shiftHour === hour;
                    })
                    .map(shift => (
                      <div
                        key={shift.id}
                        className={`p-2 rounded border cursor-pointer mb-1 ${getStatusColor(shift.status)} ${getUrgencyIndicator(shift.urgency)}`}
                        onClick={() => onShiftClick(shift)}
                      >
                        <div className="font-medium text-sm">{shift.title}</div>
                        <div className="text-xs">{shift.startTime} - {shift.endTime}</div>
                        <div className="text-xs">{shift.participant}</div>
                        {shift.worker && (
                          <div className="text-xs text-gray-600">Worker: {shift.worker}</div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-semibold text-gray-900">{getDateRange()}</h2>
          <button
            onClick={() => navigateDate('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Filters */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-input text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending_assignment">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
          </select>
          
          <select
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value)}
            className="form-input text-sm"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          
          <button
            onClick={() => onDateClick(currentDate)}
            className="btn-primary text-sm flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Add Shift
          </button>
        </div>
      </div>

      {/* Calendar Legend */}
      <div className="flex items-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-orange-200 border border-orange-300 rounded mr-2"></div>
          <span>Pending Assignment</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-200 border border-blue-300 rounded mr-2"></div>
          <span>Assigned</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-200 border border-green-300 rounded mr-2"></div>
          <span>Confirmed</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-200 border border-gray-300 rounded mr-2"></div>
          <span>Completed</span>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-lg shadow-lg">
        {viewMode === 'month' && renderMonthView()}
        {viewMode === 'week' && renderWeekView()}
        {viewMode === 'day' && renderDayView()}
      </div>

      {/* Shift Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {filteredShifts.filter(s => s.status === 'pending_assignment').length}
          </div>
          <div className="text-sm text-orange-700">Pending Assignment</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {filteredShifts.filter(s => s.status === 'assigned').length}
          </div>
          <div className="text-sm text-blue-700">Assigned</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {filteredShifts.filter(s => s.status === 'confirmed').length}
          </div>
          <div className="text-sm text-green-700">Confirmed</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {filteredShifts.filter(s => s.urgency === 'urgent' || s.urgency === 'high').length}
          </div>
          <div className="text-sm text-purple-700">High Priority</div>
        </div>
      </div>
    </div>
  );
};

export default ShiftCalendar;