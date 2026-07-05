import { useState } from "react";
import type {
  ApplicationStatus,
  InternshipApplication,
} from "../types/Application";

type ApplicationFormProps = {
  onAddApplication: (application: InternshipApplication) => void;
  onUpdateApplication: (application: InternshipApplication) => void;
  onClose: () => void;
  applicationToEdit: InternshipApplication | null;
};

function ApplicationForm({ 
  onAddApplication, 
  onUpdateApplication, 
  onClose, 
  applicationToEdit,
 }: ApplicationFormProps) {
 const [company, setCompany] = useState(applicationToEdit?.company ?? "");
 const [role, setRole] = useState(applicationToEdit?.role ?? "");
 const [location, setLocation] = useState(applicationToEdit?.location ?? "");
 const [jobLink, setJobLink] = useState(applicationToEdit?.jobLink ?? "");
 const [status, setStatus] = useState<ApplicationStatus>(
  applicationToEdit?.status ?? "Saved"
 );
 const [dateApplied, setDateApplied] = useState(
  applicationToEdit?.dateApplied ?? ""
 );
 const [deadline, setDeadline] = useState(applicationToEdit?.deadline ?? "");
 const [interviewDate, setInterviewDate] = useState(
  applicationToEdit?.interviewDate ?? ""
 );
 const [notes, setNotes] = useState(applicationToEdit?.notes ?? "");

  function handleSubmit(event: React.FormEvent) {
   event.preventDefault();

   const savedApplication: InternshipApplication = {
     id: applicationToEdit?.id ?? Date.now(),
     company,
     role,
     location,
     jobLink,
     status,
     dateApplied,
     deadline,
     interviewDate: interviewDate || undefined,
     notes,
     nextAction: applicationToEdit?.nextAction ?? "",
    };

   if (applicationToEdit) {
     onUpdateApplication(savedApplication);
   } else {
     onAddApplication(savedApplication);
   }

   onClose();
  }

  return (
    <div className="form-overlay">
      <form className="application-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2>{applicationToEdit ? "Edit Application" : "Add Application"}</h2>
          <button type="button" onClick={onClose} className="close-button">
            ×
          </button>
        </div>

        <label>
          Company
          <input
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            required
          />
        </label>

        <label>
          Role
          <input
            value={role}
            onChange={(event) => setRole(event.target.value)}
            required
          />
        </label>

        <label>
          Location
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
        </label>

        <label>
          Job Link
          <input
            value={jobLink}
            onChange={(event) => setJobLink(event.target.value)}
          />
        </label>

        <label>
          Status
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as ApplicationStatus)
            }
          >
            <option value="Saved">Saved</option>
            <option value="Applied">Applied</option>
            <option value="Technical Assessment">Technical Assessment</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
            <option value="Offer">Offer</option>
          </select>
        </label>

        <label>
          Date Applied
          <input
            type="date"
            value={dateApplied}
            onChange={(event) => setDateApplied(event.target.value)}
          />
        </label>

        <label>
          Deadline
          <input
            type="date"
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
          />
        </label>

        <label>
          Interview Date
          <input
            type="date"
            value={interviewDate}
            onChange={(event) => setInterviewDate(event.target.value)}
          />
        </label>

        <label>
          Notes
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </label>

        <button type="submit" className="primary-button">
          {applicationToEdit ? "Save Changes" : "Save Application"}
        </button>
      </form>
    </div>
  );
}

export default ApplicationForm;