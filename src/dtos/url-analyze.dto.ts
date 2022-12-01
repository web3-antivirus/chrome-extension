/* eslint-disable max-classes-per-file */
export enum PROJECT_ANALYSIS_STATUS {
  SUSPICIOUS = 'suspicious',
  DANGEROUS = 'dangerous',
  VALIDATED = 'validated',
  NEUTRAL = 'neutral',
}

export interface ValidatedAnalysisPayloadDTO {
  name: string;
  category: string;
  subcategory: string;
}

export interface UrlAnalyzeDTO {
  status: PROJECT_ANALYSIS_STATUS;
  payload: {
    nearestURL: string;
  };
}
export interface AnalyzeURLRequestDTO {
  url: string;
}
export interface AddURLsToWhitelistRequestDTO {
  urls: string[];
  rebuildModel: boolean;
}

export interface URLAnalysisDTO {
  phishing: boolean;
  nearestURL: string;
  levensteinDistance: number;
}

export interface SuspiciousAnalysisPayloadDTO {
  nearestURL: string;
  levensteinDistance: number;
}

export interface BaseAnalysisDescriptorDTO {
  status: PROJECT_ANALYSIS_STATUS;
}

export interface ValidatedAnalysisDescriptorDTO {
  status: PROJECT_ANALYSIS_STATUS.VALIDATED;
  payload: ValidatedAnalysisPayloadDTO;
}

export interface SuspiciousAnalysisDescriptorDTO {
  status: PROJECT_ANALYSIS_STATUS.SUSPICIOUS;
  payload: SuspiciousAnalysisPayloadDTO;
}

export type AnalysisDescriptorDTO = ValidatedAnalysisDescriptorDTO | SuspiciousAnalysisDescriptorDTO | BaseAnalysisDescriptorDTO;
