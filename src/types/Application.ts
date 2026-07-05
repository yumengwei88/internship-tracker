export type ApplicationStatus =
  | "Saved"
  | "Applied"
  | "Online Assessment"
  | "Interview"
  | "Rejected"
  | "Offer";

export type InternshipApplication = {
  id: number;
  company: string;
  role: string;
  location: string;
  jobLink: string;
  status: ApplicationStatus;
  dateApplied: string;
  deadline: string;
  interviewDate?: string;
  notes: string;
  nextAction: string;
};