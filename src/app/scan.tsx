import React from 'react';

import { ScreenContainer } from '@/components/ui/screen-container';
import { TabIcon } from '@/components/ui/tab-icon';

export default function ScanScreen() {
  return (
    <ScreenContainer
      title="Scan"
      subtitle="Visual crop disease diagnosis and automated risk assessment trigger"
      icon={<TabIcon name="scan" color="#2E7D32" size={40} />}
    />
  );
}
