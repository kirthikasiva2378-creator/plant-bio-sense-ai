import React from 'react';

import { ScreenContainer } from '@/components/ui/screen-container';
import { TabIcon } from '@/components/ui/tab-icon';

export default function ProfileScreen() {
  return (
    <ScreenContainer
      title="Profile"
      subtitle="User profile, app settings, region configurations, and preferences"
      icon={<TabIcon name="profile" color="#2E7D32" size={40} />}
    />
  );
}
