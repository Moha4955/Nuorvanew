import { useState, useEffect } from 'react';
import * as yup from 'yup';
import { FormValidationError, FormValidationResult } from '../types/ndis';

interface UseFormValidationOptions {
  schema: yup.ObjectSchema<any>;
  validateOnChange?: boolean;
  debounceMs?: number;
}

export const useFormValidation = (
  formData: any,
  options: UseFormValidationOptions
) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const validateField = async (fieldName: string, value: any): Promise<string | null> => {
    try {
      await options.schema.validateAt(fieldName, { [fieldName]: value });
      return null;
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        return error.message;
      }
      return 'Validation error';
    }
  };

  const validateForm = async (): Promise<FormValidationResult> => {
    setIsValidating(true);
    
    try {
      await options.schema.validate(formData, { abortEarly: false });
      setErrors({});
      setIsValid(true);
      return { isValid: true, errors: [] };
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors: Record<string, string> = {};
        const formattedErrors: FormValidationError[] = [];
        
        error.inner.forEach((err) => {
          if (err.path) {
            validationErrors[err.path] = err.message;
            formattedErrors.push({
              field: err.path,
              message: err.message,
              code: err.type || 'validation_error'
            });
          }
        });
        
        setErrors(validationErrors);
        setIsValid(false);
        return { isValid: false, errors: formattedErrors };
      }
      
      setIsValid(false);
      return { isValid: false, errors: [{ field: 'general', message: 'Validation failed', code: 'unknown_error' }] };
    } finally {
      setIsValidating(false);
    }
  };

  const clearErrors = () => {
    setErrors({});
    setIsValid(false);
  };

  const setFieldError = (fieldName: string, message: string) => {
    setErrors(prev => ({ ...prev, [fieldName]: message }));
    setIsValid(false);
  };

  const clearFieldError = (fieldName: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  // Auto-validate on form data changes
  useEffect(() => {
    if (options.validateOnChange) {
      const debounceTimer = setTimeout(() => {
        validateForm();
      }, options.debounceMs || 300);

      return () => clearTimeout(debounceTimer);
    }
  }, [formData, options.validateOnChange, options.debounceMs]);

  return {
    errors,
    isValid,
    isValidating,
    validateForm,
    validateField,
    clearErrors,
    setFieldError,
    clearFieldError
  };
};

// Validation schemas for NDIS forms
export const serviceAgreementSchema = yup.object({
  participantInfo: yup.object({
    fullName: yup.string()
      .required('Full name is required')
      .min(2, 'Name must be at least 2 characters'),
    ndisNumber: yup.string()
      .matches(/^\d{9}$/, 'NDIS number must be exactly 9 digits')
      .required('NDIS number is required'),
    dateOfBirth: yup.date()
      .max(new Date(), 'Date of birth cannot be in the future')
      .required('Date of birth is required'),
    address: yup.object({
      street: yup.string().required('Street address is required'),
      suburb: yup.string().required('Suburb is required'),
      state: yup.string().required('State is required'),
      postcode: yup.string()
        .matches(/^\d{4}$/, 'Postcode must be 4 digits')
        .required('Postcode is required'),
      country: yup.string().default('Australia')
    }),
    emergencyContact: yup.object({
      fullName: yup.string().required('Emergency contact name is required'),
      phone: yup.string()
        .matches(/^(\+61|0)[2-9]\d{8}$/, 'Please enter a valid Australian phone number')
        .required('Emergency contact phone is required'),
      relationship: yup.string().required('Relationship is required'),
      email: yup.string().email('Invalid email format').optional()
    }),
    supportCoordinator: yup.object({
      name: yup.string().optional(),
      phone: yup.string()
        .matches(/^(\+61|0)[2-9]\d{8}$/, 'Please enter a valid Australian phone number')
        .optional(),
      email: yup.string().email('Invalid email format').optional(),
      organization: yup.string().optional()
    }).optional()
  }),
  serviceDetails: yup.object({
    serviceTypes: yup.array()
      .min(1, 'At least one service type must be selected')
      .required('Service types are required'),
    startDate: yup.date()
      .min(new Date(), 'Start date must be in the future')
      .required('Start date is required'),
    reviewDate: yup.date()
      .min(yup.ref('startDate'), 'Review date must be after start date')
      .required('Review date is required'),
    serviceLocation: yup.string().required('Service location is required')
  }),
  supportTeam: yup.object({
    primary_worker: yup.string().optional(),
    team_leader: yup.string().optional(),
    nurova_representative: yup.string().required('Nurova representative is required')
  })
});

export const riskAssessmentSchema = yup.object({
  basicInfo: yup.object({
    participantName: yup.string().required('Participant name is required'),
    assessmentDate: yup.date().required('Assessment date is required'),
    assessedBy: yup.string().required('Assessor name is required')
  }),
  riskIdentification: yup.object({
    physicalHealth: yup.object({
      identified_risks: yup.array().of(yup.string()),
      risk_level: yup.string().oneOf(['low', 'medium', 'high']).required(),
      likelihood: yup.string().oneOf(['rare', 'unlikely', 'possible', 'likely', 'almost_certain']).required(),
      consequence: yup.string().oneOf(['insignificant', 'minor', 'moderate', 'major', 'catastrophic']).required(),
      current_controls: yup.array().of(yup.string())
    }),
    environmental: yup.object({
      identified_risks: yup.array().of(yup.string()),
      risk_level: yup.string().oneOf(['low', 'medium', 'high']).required(),
      likelihood: yup.string().oneOf(['rare', 'unlikely', 'possible', 'likely', 'almost_certain']).required(),
      consequence: yup.string().oneOf(['insignificant', 'minor', 'moderate', 'major', 'catastrophic']).required(),
      current_controls: yup.array().of(yup.string())
    }),
    behavioral: yup.object({
      identified_risks: yup.array().of(yup.string()),
      risk_level: yup.string().oneOf(['low', 'medium', 'high']).required(),
      likelihood: yup.string().oneOf(['rare', 'unlikely', 'possible', 'likely', 'almost_certain']).required(),
      consequence: yup.string().oneOf(['insignificant', 'minor', 'moderate', 'major', 'catastrophic']).required(),
      current_controls: yup.array().of(yup.string())
    }),
    communication: yup.object({
      identified_risks: yup.array().of(yup.string()),
      risk_level: yup.string().oneOf(['low', 'medium', 'high']).required(),
      likelihood: yup.string().oneOf(['rare', 'unlikely', 'possible', 'likely', 'almost_certain']).required(),
      consequence: yup.string().oneOf(['insignificant', 'minor', 'moderate', 'major', 'catastrophic']).required(),
      current_controls: yup.array().of(yup.string())
    })
  }),
  mitigationPlanning: yup.object({
    strategies: yup.array().of(yup.object({
      risk_area: yup.string().required(),
      strategy: yup.string().required(),
      responsible_person: yup.string().required(),
      implementation_date: yup.date().required(),
      review_date: yup.date().required(),
      effectiveness: yup.string().oneOf(['low', 'medium', 'high']).required()
    })),
    monitoring: yup.array().of(yup.object({
      area: yup.string().required(),
      procedure: yup.string().required(),
      frequency: yup.string().required(),
      responsible_person: yup.string().required(),
      documentation_required: yup.boolean().required()
    })),
    emergency: yup.array().of(yup.object({
      scenario: yup.string().required(),
      immediate_actions: yup.array().of(yup.string()).min(1),
      contact_persons: yup.array().of(yup.object({
        fullName: yup.string().required(),
        phone: yup.string().required(),
        relationship: yup.string().required()
      })),
      escalation_process: yup.string().required()
    }))
  })
});

export const incidentReportSchema = yup.object({
  incidentDetails: yup.object({
    incidentDate: yup.date().max(new Date(), 'Incident date cannot be in the future').required(),
    incidentTime: yup.string().required('Incident time is required'),
    location: yup.string().required('Location is required'),
    incidentType: yup.string().required('Incident type is required'),
    severity: yup.string().oneOf(['low', 'medium', 'high', 'critical']).required(),
    description: yup.string().min(10, 'Description must be at least 10 characters').required()
  }),
  peopleInvolved: yup.object({
    participantInvolved: yup.boolean().required(),
    injuriesSustained: yup.array().of(yup.object({
      person_affected: yup.string().required(),
      injury_type: yup.string().required(),
      body_part: yup.string().required(),
      severity: yup.string().oneOf(['minor', 'moderate', 'serious', 'critical']).required(),
      medical_treatment: yup.string().required()
    })),
    witnesses: yup.array().of(yup.object({
      name: yup.string().required(),
      contact_details: yup.string().required(),
      statement: yup.string().required(),
      relationship_to_participant: yup.string().required()
    }))
  }),
  immediateResponse: yup.object({
    immediateActions: yup.string().required('Immediate actions are required'),
    emergencyServicesCalled: yup.boolean().required(),
    medicalAttentionRequired: yup.boolean().required(),
    reportedTo: yup.array().of(yup.string()).min(1, 'Must report to at least one person')
  }),
  followUp: yup.object({
    investigationFindings: yup.string().optional(),
    correctiveActions: yup.array().of(yup.object({
      action: yup.string().required(),
      responsible_person: yup.string().required(),
      target_date: yup.date().required(),
      completion_date: yup.date().optional(),
      status: yup.string().oneOf(['planned', 'in_progress', 'completed']).required()
    })),
    preventionMeasures: yup.string().optional(),
    ndisCommissionNotified: yup.boolean().required()
  })
});

export const supportPlanSchema = yup.object({
  participantVision: yup.object({
    vision: yup.string().required('Participant vision is required'),
    strengths: yup.array().of(yup.string()).min(1, 'At least one strength must be identified'),
    preferences: yup.object({
      communication_style: yup.string().required(),
      learning_style: yup.string().required(),
      cultural_considerations: yup.array().of(yup.string()),
      environmental_preferences: yup.array().of(yup.string())
    })
  }),
  goals: yup.object({
    shortTerm: yup.array().of(yup.object({
      description: yup.string().required(),
      target_date: yup.date().required(),
      success_criteria: yup.array().of(yup.string()).min(1),
      support_required: yup.string().required(),
      responsible_person: yup.string().required(),
      progress_status: yup.string().oneOf(['not_started', 'in_progress', 'achieved', 'modified']).required()
    })).min(1, 'At least one short-term goal is required'),
    mediumTerm: yup.array().of(yup.object({
      description: yup.string().required(),
      target_date: yup.date().required(),
      success_criteria: yup.array().of(yup.string()).min(1),
      support_required: yup.string().required(),
      responsible_person: yup.string().required(),
      progress_status: yup.string().oneOf(['not_started', 'in_progress', 'achieved', 'modified']).required()
    })),
    longTerm: yup.array().of(yup.object({
      description: yup.string().required(),
      target_date: yup.date().required(),
      success_criteria: yup.array().of(yup.string()).min(1),
      support_required: yup.string().required(),
      responsible_person: yup.string().required(),
      progress_status: yup.string().oneOf(['not_started', 'in_progress', 'achieved', 'modified']).required()
    }))
  }),
  supportAreas: yup.object({
    dailyLiving: yup.object({
      current_situation: yup.string().required(),
      desired_outcomes: yup.array().of(yup.string()).min(1),
      support_strategies: yup.array().of(yup.string()).min(1),
      frequency: yup.string().required(),
      responsible_team_members: yup.array().of(yup.string()).min(1)
    }),
    community: yup.object({
      current_situation: yup.string().required(),
      desired_outcomes: yup.array().of(yup.string()).min(1),
      support_strategies: yup.array().of(yup.string()).min(1),
      frequency: yup.string().required(),
      responsible_team_members: yup.array().of(yup.string()).min(1)
    }),
    capacityBuilding: yup.object({
      current_situation: yup.string().required(),
      desired_outcomes: yup.array().of(yup.string()).min(1),
      support_strategies: yup.array().of(yup.string()).min(1),
      frequency: yup.string().required(),
      responsible_team_members: yup.array().of(yup.string()).min(1)
    }),
    healthWellbeing: yup.object({
      current_situation: yup.string().required(),
      desired_outcomes: yup.array().of(yup.string()).min(1),
      support_strategies: yup.array().of(yup.string()).min(1),
      frequency: yup.string().required(),
      responsible_team_members: yup.array().of(yup.string()).min(1)
    })
  }),
  implementation: yup.object({
    technology: yup.array().of(yup.object({
      technology_type: yup.string().required(),
      purpose: yup.string().required(),
      training_required: yup.boolean().required(),
      support_needed: yup.string().required()
    })),
    tracking: yup.object({
      review_frequency: yup.string().required(),
      measurement_methods: yup.array().of(yup.string()).min(1),
      reporting_format: yup.string().required(),
      stakeholders_involved: yup.array().of(yup.string()).min(1)
    }),
    reviews: yup.object({
      formal_reviews: yup.array().of(yup.object({
        date: yup.date().required(),
        type: yup.string().oneOf(['formal', 'informal', 'emergency']).required(),
        attendees: yup.array().of(yup.string()).min(1),
        agenda_items: yup.array().of(yup.string()).min(1)
      })),
      informal_check_ins: yup.array().of(yup.object({
        date: yup.date().required(),
        type: yup.string().oneOf(['formal', 'informal', 'emergency']).required(),
        attendees: yup.array().of(yup.string()).min(1),
        agenda_items: yup.array().of(yup.string()).min(1)
      })),
      emergency_review_triggers: yup.array().of(yup.string())
    }),
    team: yup.array().of(yup.object({
      team_member: yup.string().required(),
      role: yup.string().required(),
      responsibilities: yup.array().of(yup.string()).min(1),
      contact_details: yup.string().required()
    })).min(1, 'At least one team member must be assigned')
  })
});