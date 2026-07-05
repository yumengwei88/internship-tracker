type StatCardProps = {
  label: string;
  value: number;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="stat-card">
      <p>{label}</p>
      <h2>{value}</h2>
    </div>
  );
}

export default StatCard;