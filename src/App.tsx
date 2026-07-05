import { useEffect, useState } from "react";
import "./App.css";
import ApplicationCard from "./components/ApplicationCard";
import ApplicationForm from "./components/ApplicationForm";
import { sampleApplications } from "./data/sampleApplications";
import type {
  ApplicationStatus,
  InternshipApplication,
} from "./types/Application";

type FilterStatus = ApplicationStatus | "All";

const statuses: FilterStatus[] = [
  "All",
  "Saved",
  "Applied",
  "Technical Assessment",
  "Interview",
  "Rejected",
  "Offer",
];

function App() {
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [applicationToEdit, setApplicationToEdit] =
  useState<InternshipApplication | null>(null);
  const [applications, setApplications] = useState<InternshipApplication[]>(() => {
  const savedApplications = localStorage.getItem("applications");
  

  if (savedApplications) {
    try {
      return JSON.parse(savedApplications);
    } catch {
      return sampleApplications;
    }
  }

  return sampleApplications;
 });

  const [isFormOpen, setIsFormOpen] = useState(false);
  useEffect(() => {
    localStorage.setItem("applications", JSON.stringify(applications));
  }, [applications]);

  const normalizedSearchTerm = searchTerm.toLowerCase().trim();

  const filteredApplications = applications.filter((application) => {
    const matchesStatus =
      selectedStatus === "All" || application.status === selectedStatus;

    const matchesSearch = 
      normalizedSearchTerm === "" ||
      application.company.toLowerCase().includes(normalizedSearchTerm) ||
      application.role.toLowerCase().includes(normalizedSearchTerm) ||
      application.location.toLowerCase().includes(normalizedSearchTerm);

    return matchesStatus && matchesSearch;
  });

  function handleAddApplication(newApplication: InternshipApplication) {
    setApplications([newApplication, ...applications]);
  }

  function handleEditApplication(application: InternshipApplication) {
   setApplicationToEdit(application);
   setIsFormOpen(true);
  }

  function handleUpdateApplication(updatedApplication: InternshipApplication) {
   setApplications((currentApplications) =>
    currentApplications.map((application) =>
      application.id === updatedApplication.id
        ? updatedApplication
        : application
     )
   );

  setApplicationToEdit(null);
  }

  function handleCloseForm() {
   setIsFormOpen(false);
   setApplicationToEdit(null);
  }

  function handleDeleteApplication(id: number) {
   setApplications((currentApplications) =>
    currentApplications.filter((application) => application.id !== id)
  );
  }

  return (
    <>
      <header className="top-header">
        <h1>Personal Internship Tracker</h1>

        <button
          className="primary-button header-button"
          onClick={() => {
            setApplicationToEdit(null);
            setIsFormOpen(true);
          }}
        >
          Add Application
        </button>
      </header>

      <main className="app">
        <section className="tracker-section">
          <div className="section-header">
            <h2>Applications</h2>

            <div className="tracker-controls">
              <input
                className="search-input"
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />

              <select
                value={selectedStatus}
                onChange={(event) =>
                  setSelectedStatus(event.target.value as FilterStatus)
                }
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="applications-list">
            {filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onDeleteApplication={handleDeleteApplication}
                onEditApplication={handleEditApplication}
              />
            ))}
          </div>
        </section>
      </main>

      {isFormOpen && (
       <ApplicationForm
         onAddApplication={handleAddApplication}
         onUpdateApplication={handleUpdateApplication}
         onClose={handleCloseForm}
         applicationToEdit={applicationToEdit}
       />
      )}
    </>
  );
}

export default App;