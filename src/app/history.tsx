import React from 'react';

import { ScreenContainer } from '@/components/ui/screen-container';
import { TabIcon } from '@/components/ui/tab-icon';

export default function HistoryScreen() {
  return (
    <ScreenContainer
      title="History"
      subtitle="View past visual diagnoses, disease logs, and historical scan records"
      icon={<TabIcon name="history" color="#2E7D32" size={40} />}
    />
  );
}
