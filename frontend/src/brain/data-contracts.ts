/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** HealthResponse */
export interface HealthResponse {
  /** Status */
  status: string;
}

/** ScamDetectionRequest */
export interface ScamDetectionRequest {
  /**
   * Content
   * The text, URL, phone number, or content to analyze for scams
   */
  content: string;
  /**
   * Content Type
   * Type of content being analyzed: 'text', 'url', 'phone', 'email', or 'image_text'
   * @default "text"
   */
  content_type?: string;
}

/** ScamDetectionResponse */
export interface ScamDetectionResponse {
  /**
   * Is Scam
   * Whether the content is likely a scam
   */
  is_scam: boolean;
  /**
   * Threat Level
   * Categorized threat level: 'safe', 'suspicious', or 'dangerous'
   */
  threat_level: string;
  /**
   * Confidence Score
   * Overall confidence score from 0 to 1
   * @min 0
   * @max 1
   */
  confidence_score: number;
  /**
   * Indicators
   * List of scam indicators found
   */
  indicators?: ScamIndicator[];
  /**
   * Analysis
   * Detailed analysis of the content
   */
  analysis: string;
  /**
   * Recommendations
   * Recommended actions for the user
   */
  recommendations?: string[];
  /**
   * Scan Id
   * Unique ID for this scan
   */
  scan_id: string;
}

/** ScamIndicator */
export interface ScamIndicator {
  /**
   * Name
   * Name of the scam indicator
   */
  name: string;
  /**
   * Description
   * Description of why this is suspicious
   */
  description: string;
  /**
   * Confidence
   * Confidence score from 0 to 1
   * @min 0
   * @max 1
   */
  confidence: number;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

export type CheckHealthData = HealthResponse;

export type DetectScamData = ScamDetectionResponse;

export type DetectScamError = HTTPValidationError;

export interface GetScanHistoryParams {
  /**
   * Limit
   * @default 10
   */
  limit?: number;
}

/** Response Get Scan History */
export type GetScanHistoryData = object[];

export type GetScanHistoryError = HTTPValidationError;

export interface GetScanByIdParams {
  /** Scan Id */
  scanId: string;
}

/** Response Get Scan By Id */
export type GetScanByIdData = object;

export type GetScanByIdError = HTTPValidationError;
