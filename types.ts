
export type TruckBrand = 'Renault' | 'Volvo' | 'Scania' | 'MAN' | 'DAF' | 'Iveco' | 'Ford';

export type Language = 'ar' | 'en' | 'fr';

export interface User {
  name: string;
  email?: string; // Made optional
  photoUrl?: string;
  isRegistered: boolean;
  isPro?: boolean;
}

export interface FaultCodeData {
  mid: string;
  pid?: string;
  sid?: string;
  fmi: string;
}

export interface DiagnosisResult {
  system: string;
  description: string;
  symptoms: string[];
  causes: string[];
  solutions: string[];
  severity: 'low' | 'medium' | 'high';
  partName?: string; // New field for the specific component name
}

export enum AppMode {
  HOME = 'HOME',
  DECODER = 'DECODER',
  SENSORS = 'SENSORS',
  MAINTENANCE = 'MAINTENANCE',
  CHAT = 'CHAT',
  AUTH = 'AUTH'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface SensorData {
  id: string;
  name: string;
  code: string; // e.g. "B12"
  function: string;
  location: string;
  symptoms: string[];
  description: string;
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  type: string;
  mileage: number;
  notes: string;
  cost?: number;
}