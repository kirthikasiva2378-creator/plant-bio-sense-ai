export interface UserProfile {
  greeting: string;
  name: string;
  avatarInitials: string;
}

export type HealthStatusType = 'healthy' | 'attention' | 'warning';

export interface CropHealthSummary {
  status: string;
  percentage: number;
  statusType: HealthStatusType;
  lastUpdated: string;
  monitoredCropsCount: number;
}

export interface CropItem {
  id: string;
  name: string;
  variety?: string;
  growingType: string; // 'Home Garden' | 'Terrace Garden' | 'Farm' | 'Greenhouse'
  status: string;
  healthScore: number;
  statusType: HealthStatusType;
  icon: string;
  lastChecked: string;
  fieldLocation?: string;
}

export interface CropRiskSummary {
  level: 'low' | 'medium' | 'high';
  statusText: string;
  description: string;
  riskFactorCount: number;
}

export const MOCK_USER_PROFILE: UserProfile = {
  greeting: 'Good Morning 👋',
  name: 'Welcome to Plant BioSense',
  avatarInitials: 'PB',
};

export const MOCK_CROP_HEALTH_SUMMARY: CropHealthSummary = {
  status: 'Healthy',
  percentage: 82,
  statusType: 'healthy',
  lastUpdated: 'Updated today at 8:30 AM',
  monitoredCropsCount: 3,
};

export const MOCK_CROPS_LIST: CropItem[] = [
  {
    id: 'crop-1',
    name: 'Tomato',
    variety: 'Roma Hybrid',
    growingType: 'Home Garden',
    status: 'Healthy',
    healthScore: 88,
    statusType: 'healthy',
    icon: '🍅',
    lastChecked: 'Today',
    fieldLocation: 'North Plot A',
  },
  {
    id: 'crop-2',
    name: 'Chilli',
    variety: 'Guntur Red',
    growingType: 'Farm',
    status: 'Needs attention',
    healthScore: 65,
    statusType: 'attention',
    icon: '🌶️',
    lastChecked: 'Yesterday',
    fieldLocation: 'East Plot B',
  },
  {
    id: 'crop-3',
    name: 'Brinjal',
    variety: 'Purple Long',
    growingType: 'Terrace Garden',
    status: 'Healthy',
    healthScore: 92,
    statusType: 'healthy',
    icon: '🍆',
    lastChecked: '2 days ago',
    fieldLocation: 'South Plot C',
  },
];

export const MOCK_CROP_RISK: CropRiskSummary = {
  level: 'low',
  statusText: 'No immediate risk',
  description: 'Your crops are currently within optimal monitored health conditions.',
  riskFactorCount: 0,
};
