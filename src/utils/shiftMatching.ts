// Advanced shift matching algorithm for optimal worker assignment

import { SupportWorkerProfile, ServiceRequest, ParticipantProfile } from '../types';

export interface WorkerMatchResult {
  workerId: string;
  matchScore: number;
  matchFactors: MatchFactor[];
  availability: AvailabilityMatch;
  estimatedCost: number;
  travelTime: number;
  riskCompatibility: boolean;
}

export interface MatchFactor {
  category: 'distance' | 'specialization' | 'rating' | 'experience' | 'language' | 'availability' | 'preference';
  score: number;
  weight: number;
  description: string;
}

export interface AvailabilityMatch {
  isAvailable: boolean;
  conflictingShifts: string[];
  availableSlots: TimeSlot[];
  preferredSlots: TimeSlot[];
}

export interface TimeSlot {
  start: string;
  end: string;
  date: string;
}

// Matching weights for different factors
const MATCH_WEIGHTS = {
  distance: 0.25,
  specialization: 0.30,
  rating: 0.15,
  experience: 0.10,
  language: 0.10,
  availability: 0.10
};

export const findBestWorkerMatches = (
  serviceRequest: ServiceRequest,
  participant: ParticipantProfile,
  availableWorkers: SupportWorkerProfile[],
  existingShifts: any[] = []
): WorkerMatchResult[] => {
  
  const matches: WorkerMatchResult[] = [];

  for (const worker of availableWorkers) {
    const matchScore = calculateMatchScore(serviceRequest, participant, worker);
    const availability = checkWorkerAvailability(worker, serviceRequest, existingShifts);
    const estimatedCost = calculateEstimatedCost(serviceRequest, worker);
    const travelTime = calculateTravelTime(participant.address, worker.address);
    const riskCompatibility = assessRiskCompatibility(participant.riskAssessment, worker);

    matches.push({
      workerId: worker.id,
      matchScore,
      matchFactors: getMatchFactors(serviceRequest, participant, worker),
      availability,
      estimatedCost,
      travelTime,
      riskCompatibility
    });
  }

  // Sort by match score (highest first)
  return matches.sort((a, b) => b.matchScore - a.matchScore);
};

const calculateMatchScore = (
  request: ServiceRequest,
  participant: ParticipantProfile,
  worker: SupportWorkerProfile
): number => {
  let totalScore = 0;

  // Distance scoring (closer is better)
  const distance = calculateDistance(participant.address, worker.address);
  const distanceScore = Math.max(0, 100 - (distance * 5)); // Penalty of 5 points per km
  totalScore += distanceScore * MATCH_WEIGHTS.distance;

  // Specialization matching
  const specializationScore = calculateSpecializationMatch(request, worker);
  totalScore += specializationScore * MATCH_WEIGHTS.specialization;

  // Rating bonus
  const ratingScore = (worker.performanceMetrics.averageRating / 5) * 100;
  totalScore += ratingScore * MATCH_WEIGHTS.rating;

  // Experience scoring
  const experienceScore = Math.min(100, worker.performanceMetrics.totalServicesCompleted * 2);
  totalScore += experienceScore * MATCH_WEIGHTS.experience;

  // Language matching
  const languageScore = calculateLanguageMatch(participant, worker);
  totalScore += languageScore * MATCH_WEIGHTS.language;

  // Availability bonus
  const availabilityScore = worker.availability.length > 0 ? 100 : 0;
  totalScore += availabilityScore * MATCH_WEIGHTS.availability;

  return Math.min(100, Math.max(0, totalScore));
};

const calculateSpecializationMatch = (request: ServiceRequest, worker: SupportWorkerProfile): number => {
  const requestCategories = [request.serviceCategory];
  const workerCategories = worker.serviceCategories;
  
  const matches = requestCategories.filter(cat => workerCategories.includes(cat));
  const matchPercentage = matches.length / requestCategories.length;
  
  // Bonus for exact requirement matches
  const requirementMatches = request.requirements.filter(req => 
    worker.qualifications.some(qual => 
      qual.name.toLowerCase().includes(req.description.toLowerCase())
    )
  );
  
  const requirementBonus = (requirementMatches.length / request.requirements.length) * 20;
  
  return Math.min(100, (matchPercentage * 80) + requirementBonus);
};

const calculateLanguageMatch = (participant: ParticipantProfile, worker: SupportWorkerProfile): number => {
  // Check if participant has language preferences
  const participantLanguagePrefs = participant.communicationPreferences.filter(pref => 
    ['spanish', 'mandarin', 'arabic', 'vietnamese'].some(lang => 
      pref.toLowerCase().includes(lang)
    )
  );
  
  if (participantLanguagePrefs.length === 0) return 50; // Neutral score if no language preference
  
  // Check if worker speaks required languages (this would come from worker profile)
  // For now, simplified check
  return 100; // Assume match for demo
};

const checkWorkerAvailability = (
  worker: SupportWorkerProfile,
  request: ServiceRequest,
  existingShifts: any[]
): AvailabilityMatch => {
  const requestDate = new Date(request.preferredDate);
  const dayOfWeek = requestDate.getDay();
  
  // Check if worker is generally available on this day
  const dayAvailability = worker.availability.find(slot => slot.dayOfWeek === dayOfWeek);
  
  if (!dayAvailability) {
    return {
      isAvailable: false,
      conflictingShifts: [],
      availableSlots: [],
      preferredSlots: []
    };
  }
  
  // Check for conflicting shifts
  const conflictingShifts = existingShifts.filter(shift => 
    shift.workerId === worker.id && 
    shift.scheduledDate === request.preferredDate &&
    shift.status !== 'cancelled'
  );
  
  return {
    isAvailable: conflictingShifts.length === 0,
    conflictingShifts: conflictingShifts.map(s => s.id),
    availableSlots: [
      {
        start: dayAvailability.startTime,
        end: dayAvailability.endTime,
        date: request.preferredDate.toISOString().split('T')[0]
      }
    ],
    preferredSlots: []
  };
};

const calculateEstimatedCost = (request: ServiceRequest, worker: SupportWorkerProfile): number => {
  const baseCost = request.duration * worker.hourlyRate;
  const gst = baseCost * 0.1;
  return baseCost + gst;
};

const calculateTravelTime = (participantAddress: string, workerAddress: string): number => {
  // Simplified calculation - in production, use Google Maps API
  const distance = calculateDistance(participantAddress, workerAddress);
  return Math.round(distance * 3); // Assume 3 minutes per km
};

const calculateDistance = (address1: string, address2: string): number => {
  // Simplified distance calculation - in production, use geocoding API
  return Math.random() * 20; // Random distance for demo
};

const assessRiskCompatibility = (
  riskAssessment: any,
  worker: SupportWorkerProfile
): boolean => {
  // Check if worker has appropriate qualifications for risk level
  if (!riskAssessment) return true;
  
  const riskLevel = riskAssessment.overallRiskLevel;
  
  if (riskLevel === 'high') {
    // High-risk participants need workers with advanced qualifications
    return worker.qualifications.some(qual => 
      qual.name.includes('Advanced') || 
      qual.name.includes('Specialist') ||
      qual.name.includes('Personal Care')
    );
  }
  
  return true;
};

const getMatchFactors = (
  request: ServiceRequest,
  participant: ParticipantProfile,
  worker: SupportWorkerProfile
): MatchFactor[] => {
  const factors: MatchFactor[] = [];
  
  const distance = calculateDistance(participant.address, worker.address);
  factors.push({
    category: 'distance',
    score: Math.max(0, 100 - (distance * 5)),
    weight: MATCH_WEIGHTS.distance,
    description: `${distance.toFixed(1)}km away`
  });
  
  const specializationScore = calculateSpecializationMatch(request, worker);
  factors.push({
    category: 'specialization',
    score: specializationScore,
    weight: MATCH_WEIGHTS.specialization,
    description: `${Math.round(specializationScore)}% specialization match`
  });
  
  const ratingScore = (worker.performanceMetrics.averageRating / 5) * 100;
  factors.push({
    category: 'rating',
    score: ratingScore,
    weight: MATCH_WEIGHTS.rating,
    description: `${worker.performanceMetrics.averageRating}/5 rating`
  });
  
  return factors;
};

// Bulk assignment utilities
export const assignMultipleShifts = async (
  assignments: Array<{ serviceRequestId: string; workerId: string; isRecurring?: boolean }>
): Promise<{ success: string[]; failed: Array<{ id: string; error: string }> }> => {
  const success: string[] = [];
  const failed: Array<{ id: string; error: string }> = [];
  
  for (const assignment of assignments) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 100));
      success.push(assignment.serviceRequestId);
    } catch (error) {
      failed.push({
        id: assignment.serviceRequestId,
        error: 'Assignment failed'
      });
    }
  }
  
  return { success, failed };
};

export const createRecurringShifts = async (
  serviceRequestId: string,
  workerId: string,
  pattern: {
    type: 'weekly' | 'monthly';
    interval: number;
    daysOfWeek?: number[];
    endDate?: string;
    endAfter?: number;
  }
): Promise<string[]> => {
  // Generate shift instances based on pattern
  const shiftIds: string[] = [];
  
  // This would integrate with your backend to create the actual shifts
  // For now, simulate the creation
  const numberOfShifts = pattern.endAfter || 12; // Default to 12 shifts
  
  for (let i = 0; i < numberOfShifts; i++) {
    shiftIds.push(`SH-${Date.now()}-${i}`);
  }
  
  return shiftIds;
};