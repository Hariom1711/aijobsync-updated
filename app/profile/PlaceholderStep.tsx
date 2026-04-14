/* eslint-disable @typescript-eslint/no-explicit-any */

// components/profile/PlaceholderStep.tsx

import React from "react";

interface PlaceholderStepProps {
  title: string;
  icon: React.ElementType;
}

export const PlaceholderStep: React.FC<PlaceholderStepProps> = ({
  title,
  icon: Icon,
}) => (
  <div className="text-center space-y-4 max-w-2xl mx-auto">
    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6">
      <Icon className="w-12 h-12 text-white" />
    </div>
    <h2 className="text-3xl font-black text-white">{title}</h2>
    <p className="text-purple-200">
      This section is coming soon! Click Next to continue.
    </p>
  </div>
);