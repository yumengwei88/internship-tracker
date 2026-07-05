import type { ApplicationStatus } from "../types/Application";

type StatusBadgeProps = {
  status: ApplicationStatus;
};

function StatusBadge({ status }: StatusBadgeProps) {
  const statusClass = status.toLowerCase().replace(/\s+/g, "-");

  return <span className={`status-badge ${statusClass}`}>{status}</span>;
}

export default StatusBadge;