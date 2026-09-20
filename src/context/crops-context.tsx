import React, { createContext, useContext, useState } from 'react';

import { CropItem, MOCK_CROPS_LIST } from '@/services/mock-data';

interface CropsContextType {
  crops: CropItem[];
  addCrop: (data: { name: string; variety?: string; growingType: string }) => void;
  getCropById: (id: string) => CropItem | undefined;
  clearAllCrops: () => void;
  resetToDefaultCrops: () => void;
}

const CropsContext = createContext<CropsContextType | undefined>(undefined);

const EMOJI_MAP: Record<string, string> = {
  tomato: '🍅',
  chilli: '🌶️',
  chili: '🌶️',
  brinjal: '🍆',
  eggplant: '🍆',
  potato: '🥔',
  corn: '🌽',
  maize: '🌽',
  rice: '🌾',
  paddy: '🌾',
  wheat: '🌾',
  cucumber: '🥒',
  carrot: '🥕',
  onion: '🧅',
  garlic: '🧄',
  cabbage: '🥬',
  spinach: '🥬',
  apple: '🍎',
  mango: '🥭',
  banana: '🍌',
  grape: '🍇',
  cotton: '🌱',
};

export function CropsProvider({ children }: { children: React.ReactNode }) {
  const [crops, setCrops] = useState<CropItem[]>(MOCK_CROPS_LIST);

  const addCrop = ({
    name,
    variety,
    growingType,
  }: {
    name: string;
    variety?: string;
    growingType: string;
  }) => {
    const normalizedName = name.trim().toLowerCase();
    const icon = EMOJI_MAP[normalizedName] || '🌱';

    const newCrop: CropItem = {
      id: `crop-${Date.now()}`,
      name: name.trim(),
      variety: variety?.trim() || undefined,
      growingType,
      status: 'Healthy',
      healthScore: 90,
      statusType: 'healthy',
      icon,
      lastChecked: 'Just added',
      fieldLocation: growingType,
    };

    setCrops((prev) => [newCrop, ...prev]);
  };

  const getCropById = (id: string) => {
    return crops.find((item) => item.id === id);
  };

  const clearAllCrops = () => {
    setCrops([]);
  };

  const resetToDefaultCrops = () => {
    setCrops(MOCK_CROPS_LIST);
  };

  return (
    <CropsContext.Provider
      value={{
        crops,
        addCrop,
        getCropById,
        clearAllCrops,
        resetToDefaultCrops,
      }}>
      {children}
    </CropsContext.Provider>
  );
}

export function useCrops() {
  const context = useContext(CropsContext);
  if (!context) {
    throw new Error('useCrops must be used within a CropsProvider');
  }
  return context;
}
