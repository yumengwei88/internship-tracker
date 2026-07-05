import type { InternshipApplication } from "../types/Application";

type ApplicationCardProps = {
  application: InternshipApplication;
  onDeleteApplication: (id: number) => void;
  onEditApplication: (application: InternshipApplication) => void;
};

function formatDate(date: string) {
  if (!date) return "";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusText(application: InternshipApplication) {
  if (!application.dateApplied) {
    return "Waiting";
  }

  if (application.status === "Applied") {
    return `Applied on ${formatDate(application.dateApplied)}`;
  }

  if (application.status === "Interview" && application.interviewDate) {
    return `Interview on ${formatDate(application.interviewDate)}`;
  }

  return application.status;
}

function ApplicationCard({ 
  application, 
  onDeleteApplication, 
  onEditApplication,
 }: ApplicationCardProps) {
  const statusClass = application.status.toLowerCase().replace(/\s+/g, "-");
  const isNotAppliedYet = !application.dateApplied;

  return (
    <div className="application-card">
      <h3 className="company-title">{application.company}</h3>
      <p className="company-role">{application.role}</p>


      <div className="sticky-note-lines">
        <p>
          <strong>Status:</strong>{" "}
          <span className={`status-text ${statusClass}`}>
            {getStatusText(application)}
          </span>
        </p>

        <p>
          <strong>Location:</strong> {application.location}
        </p>

        

        {isNotAppliedYet && application.deadline && (
          <p>
            <strong>Deadline:</strong> {formatDate(application.deadline)}
          </p>
        )}
      

      {application.notes && (
        <p className="notes">
          <strong>Notes:</strong> {application.notes}
        </p>
      )}
      </div>
      <div className="card-actions">
       <a href={application.jobLink} target="_blank" rel="noreferrer">
         View posting
       </a>

       <button
         className="edit-button"
         onClick={() => onEditApplication(application)}
        >
         Edit
       </button>

       <button
         className="delete-button"
         onClick={() => onDeleteApplication(application.id)}
       > 
        Delete
      </button>
     </div>
    </div>
  );
}

export default ApplicationCard;