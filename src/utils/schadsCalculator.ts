// SCHADS Award calculation utilities for NDIS support workers

export interface SchadsRates {
  level1: number; // Entry level
  level2: number; // Experienced worker
  level3: number; // Senior worker
  level4: number; // Specialist/Team leader
  level5: number; // Coordinator/Manager
}

// Current SCHADS Award rates (2024-2025) - these should be configurable
export const SCHADS_BASE_RATES: SchadsRates = {
  level1: 38.50,
  level2: 42.00,
  level3: 45.50,
  level4: 48.75,
  level5: 52.25
};

export const PENALTY_RATES = {
  evening: 1.25,    // 6PM - 10PM
  night: 1.50,      // 10PM - 6AM
  saturday: 1.25,   // All day Saturday
  sunday: 1.50,     // All day Sunday
  public_holiday: 2.00, // Public holidays
  overtime: 1.50    // Over 8 hours per day or 38 hours per week
};

export const ALLOWANCES = {
  travel_per_km: 0.85,
  meal_allowance: 15.50,
  phone_allowance: 12.00,
  uniform_allowance: 8.50
};

export interface ShiftDetails {
  date: Date;
  startTime: string; // HH:MM format
  endTime: string;   // HH:MM format
  breakTime: number; // in hours
  serviceType: string;
  location: 'participant_home' | 'community' | 'provider_location';
  travelDistance?: number; // in kilometers
  workerLevel: 1 | 2 | 3 | 4 | 5;
  isPublicHoliday?: boolean;
}

export interface SchadsCalculationResult {
  regularHours: number;
  regularPay: number;
  eveningHours: number;
  eveningPay: number;
  nightHours: number;
  nightPay: number;
  weekendHours: number;
  weekendPay: number;
  publicHolidayHours: number;
  publicHolidayPay: number;
  overtimeHours: number;
  overtimePay: number;
  totalPenalties: number;
  travelAllowance: number;
  mealAllowance: number;
  totalAllowances: number;
  grossPay: number;
  gstAmount: number;
  totalPay: number;
  breakdown: PayBreakdownItem[];
}

export interface PayBreakdownItem {
  description: string;
  hours?: number;
  rate?: number;
  amount: number;
  type: 'regular' | 'penalty' | 'allowance' | 'gst';
}

// Australian public holidays (simplified - should be configurable)
const PUBLIC_HOLIDAYS_2025 = [
  '2025-01-01', // New Year's Day
  '2025-01-27', // Australia Day
  '2025-04-18', // Good Friday
  '2025-04-21', // Easter Monday
  '2025-04-25', // ANZAC Day
  '2025-06-09', // Queen's Birthday (VIC)
  '2025-11-04', // Melbourne Cup (VIC)
  '2025-12-25', // Christmas Day
  '2025-12-26'  // Boxing Day
];

export const calculateSchadsPayment = (shiftDetails: ShiftDetails): SchadsCalculationResult => {
  const baseRate = getBaseRateForLevel(shiftDetails.workerLevel);
  const totalMinutes = calculateTotalMinutes(shiftDetails.startTime, shiftDetails.endTime);
  const totalHours = (totalMinutes / 60) - shiftDetails.breakTime;
  
  const breakdown: PayBreakdownItem[] = [];
  
  // Determine if it's a public holiday
  const isPublicHoliday = shiftDetails.isPublicHoliday || 
    PUBLIC_HOLIDAYS_2025.includes(shiftDetails.date.toISOString().split('T')[0]);
  
  // Calculate time periods
  const timePeriods = calculateTimePeriods(
    shiftDetails.date,
    shiftDetails.startTime,
    shiftDetails.endTime,
    shiftDetails.breakTime,
    isPublicHoliday
  );
  
  // Regular hours calculation
  const regularPay = timePeriods.regular * baseRate;
  breakdown.push({
    description: 'Regular Hours',
    hours: timePeriods.regular,
    rate: baseRate,
    amount: regularPay,
    type: 'regular'
  });
  
  // Evening penalty (6PM - 10PM)
  const eveningPay = timePeriods.evening * baseRate * PENALTY_RATES.evening;
  if (timePeriods.evening > 0) {
    breakdown.push({
      description: 'Evening Penalty (6PM-10PM)',
      hours: timePeriods.evening,
      rate: baseRate * PENALTY_RATES.evening,
      amount: eveningPay,
      type: 'penalty'
    });
  }
  
  // Night penalty (10PM - 6AM)
  const nightPay = timePeriods.night * baseRate * PENALTY_RATES.night;
  if (timePeriods.night > 0) {
    breakdown.push({
      description: 'Night Penalty (10PM-6AM)',
      hours: timePeriods.night,
      rate: baseRate * PENALTY_RATES.night,
      amount: nightPay,
      type: 'penalty'
    });
  }
  
  // Weekend penalty
  const weekendPay = timePeriods.weekend * baseRate * (
    shiftDetails.date.getDay() === 0 ? PENALTY_RATES.sunday : PENALTY_RATES.saturday
  );
  if (timePeriods.weekend > 0) {
    const dayName = shiftDetails.date.getDay() === 0 ? 'Sunday' : 'Saturday';
    breakdown.push({
      description: `${dayName} Penalty`,
      hours: timePeriods.weekend,
      rate: baseRate * (shiftDetails.date.getDay() === 0 ? PENALTY_RATES.sunday : PENALTY_RATES.saturday),
      amount: weekendPay,
      type: 'penalty'
    });
  }
  
  // Public holiday penalty
  const publicHolidayPay = timePeriods.publicHoliday * baseRate * PENALTY_RATES.public_holiday;
  if (timePeriods.publicHoliday > 0) {
    breakdown.push({
      description: 'Public Holiday Penalty',
      hours: timePeriods.publicHoliday,
      rate: baseRate * PENALTY_RATES.public_holiday,
      amount: publicHolidayPay,
      type: 'penalty'
    });
  }
  
  // Calculate allowances
  const travelAllowance = (shiftDetails.travelDistance || 0) * ALLOWANCES.travel_per_km;
  if (travelAllowance > 0) {
    breakdown.push({
      description: `Travel Allowance (${shiftDetails.travelDistance}km)`,
      amount: travelAllowance,
      type: 'allowance'
    });
  }
  
  // Meal allowance for shifts over 5 hours
  const mealAllowance = totalHours > 5 ? ALLOWANCES.meal_allowance : 0;
  if (mealAllowance > 0) {
    breakdown.push({
      description: 'Meal Allowance (5+ hours)',
      amount: mealAllowance,
      type: 'allowance'
    });
  }
  
  const totalPenalties = eveningPay + nightPay + weekendPay + publicHolidayPay;
  const totalAllowances = travelAllowance + mealAllowance;
  const grossPay = regularPay + totalPenalties + totalAllowances;
  const gstAmount = grossPay * 0.1; // 10% GST
  const totalPay = grossPay + gstAmount;
  
  // Add GST to breakdown
  breakdown.push({
    description: 'GST (10%)',
    amount: gstAmount,
    type: 'gst'
  });
  
  return {
    regularHours: timePeriods.regular,
    regularPay,
    eveningHours: timePeriods.evening,
    eveningPay,
    nightHours: timePeriods.night,
    nightPay,
    weekendHours: timePeriods.weekend,
    weekendPay,
    publicHolidayHours: timePeriods.publicHoliday,
    publicHolidayPay,
    overtimeHours: 0, // TODO: Implement overtime calculation
    overtimePay: 0,
    totalPenalties,
    travelAllowance,
    mealAllowance,
    totalAllowances,
    grossPay,
    gstAmount,
    totalPay,
    breakdown
  };
};

const getBaseRateForLevel = (level: 1 | 2 | 3 | 4 | 5): number => {
  switch (level) {
    case 1: return SCHADS_BASE_RATES.level1;
    case 2: return SCHADS_BASE_RATES.level2;
    case 3: return SCHADS_BASE_RATES.level3;
    case 4: return SCHADS_BASE_RATES.level4;
    case 5: return SCHADS_BASE_RATES.level5;
    default: return SCHADS_BASE_RATES.level2;
  }
};

const calculateTotalMinutes = (startTime: string, endTime: string): number => {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  
  const startMinutes = startHour * 60 + startMin;
  let endMinutes = endHour * 60 + endMin;
  
  // Handle overnight shifts
  if (endMinutes < startMinutes) {
    endMinutes += 24 * 60;
  }
  
  return endMinutes - startMinutes;
};

const calculateTimePeriods = (
  date: Date,
  startTime: string,
  endTime: string,
  breakTime: number,
  isPublicHoliday: boolean
) => {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  // For simplicity, this is a basic implementation
  // In production, you'd need more sophisticated time period calculation
  const totalMinutes = calculateTotalMinutes(startTime, endTime);
  const totalHours = (totalMinutes / 60) - breakTime;
  
  if (isPublicHoliday) {
    return {
      regular: 0,
      evening: 0,
      night: 0,
      weekend: 0,
      publicHoliday: totalHours
    };
  }
  
  if (isWeekend) {
    return {
      regular: 0,
      evening: 0,
      night: 0,
      weekend: totalHours,
      publicHoliday: 0
    };
  }
  
  // Simplified calculation - in production, you'd need to split hours across time periods
  const [startHour] = startTime.split(':').map(Number);
  const [endHour] = endTime.split(':').map(Number);
  
  let regular = 0;
  let evening = 0;
  let night = 0;
  
  // Basic time period allocation (simplified)
  if (startHour >= 6 && endHour <= 18) {
    regular = totalHours; // All regular hours
  } else if (startHour >= 18 && endHour <= 22) {
    evening = totalHours; // All evening hours
  } else if (startHour >= 22 || endHour <= 6) {
    night = totalHours; // All night hours
  } else {
    // Mixed periods - would need more complex calculation
    regular = totalHours * 0.7; // Simplified allocation
    evening = totalHours * 0.3;
  }
  
  return {
    regular,
    evening,
    night,
    weekend: 0,
    publicHoliday: 0
  };
};