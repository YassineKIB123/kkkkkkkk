'use client';

import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
}

export function DynamicIcon({ name, className = 'w-6 h-6' }: DynamicIconProps) {
  // @ts-ignore
  const IconComponent = Icons[name] || Icons.FileText;
  return <IconComponent className={className} />;
}
