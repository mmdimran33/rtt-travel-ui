
/**
 * Candidate Status
 * Maps to com.roottronics.travelcore.common.enums.Status
 */
export type CandidateStatus =
    | "ACTIVE"
    | "INACTIVE";


/**
 * Gender
 * Maps to backend validation:
 * MALE | FEMALE | OTHER
 */
export type Gender =
    | "MALE"
    | "FEMALE"
    | "OTHER";


/**
 * Create Candidate Request
 * Maps to:
 * com.roottronics.travelcore.candidate.dto.request.CreateCandidateRequest
 */
export interface CreateCandidateRequest {
    companyId: number;
    firstName: string;
    lastName?: string;
    gender: Gender;
    dateOfBirth: string;
    passportNumber: string;
    passportExpiryDate: string;
    nationality: string;
    email: string;
    mobile: string;
    address?: string;
}

export type UpdateCandidateRequest = CreateCandidateRequest;


/**
 * Candidate Response
 * Maps to:
 * com.roottronics.travelcore.candidate.dto.response.CandidateResponse
 */
export interface CandidateResponse {
    id: number;
    tenantId: number;
    companyId: number;
    firstName: string;
    lastName?: string;
    gender: Gender;
    dateOfBirth: string;
    passportNumber: string;
    passportExpiryDate: string;
    nationality: string;
    email: string;
    mobile: string;
    address?: string;
    status: CandidateStatus;
    createdDate: string;
    updatedDate: string;
}


/**
 * API Response
 * Use this if your Spring Boot APIs return:
 *
 * {
 *   success: true,
 *   message: "...",
 *   data: [...]
 * }
 */
export interface CandidateApiResponse {
    success: boolean;
    message?: string;
    data: CandidateResponse[];
}


/**
 * Single Candidate API Response
 */
export interface CandidateSingleApiResponse {
    success: boolean;
    message?: string;
    data: CandidateResponse;
}
