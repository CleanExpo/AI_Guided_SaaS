import React from 'react';
import { CheckIcon, AlertTriangleIcon, XCircleIcon } from 'lucide-react';

interface StateIconProps {
  state: 'default' | 'error' | 'success' | 'warning';
  loading?: boolean;
  rightIcon?: React.ReactNode;
}

export function StateIcon({ state, loading, rightIcon }: StateIconProps) {
  if (loading) {
    return (<div className="animate-spin w-4 h-4 -2 -current -t-transparent rounded-lg-full" />)
    );
  }

  switch (state) {
    case 'error':
      return <XCircleIcon size={16} className="text-red-500" />;
    case 'success':
      return <CheckIcon size={16} className="text-green-500" />;
    case 'warning':
      return <AlertTriangleIcon size={16} className="text-yellow-500" />;
    default:
      return rightIcon ? <>{rightIcon}</> : null;
  }
}