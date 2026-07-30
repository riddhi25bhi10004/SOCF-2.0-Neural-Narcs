interface StatusBadgeProps {
  status: 'online' | 'warning' | 'critical' | 'optimal' | 'nominal' | 'elevated';
  label: string;
  size?: 'sm' | 'md';
}

const statusConfig: Record<StatusBadgeProps['status'], { bg: string; text: string; dot: string }> = {
  online: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  warning: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  critical: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  optimal: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  nominal: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  elevated: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
};

function StatusBadge({ status, label, size = 'sm' }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bg} ${config.text} ${sizeClasses}`}>
      <span className={`relative flex h-1.5 w-1.5 ${config.dot}`}>
        <span className={`absolute inline-flex h-full w-full rounded-full ${config.dot} opacity-75 animate-ping`} />
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${config.dot}`} />
      </span>
      {label}
    </span>
  );
}

export default StatusBadge;