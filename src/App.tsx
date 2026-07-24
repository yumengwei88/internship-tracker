import { useEffect, useState } from "react";
import "./App.css";
import ApplicationCard from "./components/ApplicationCard";
import ApplicationForm from "./components/ApplicationForm";
import type {
  ApplicationStatus,
  InternshipApplication,
} from "./types/Application";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";

type FilterStatus = ApplicationStatus | "All";

type DatabaseApplication = {
  id: number;
  company: string;
  role: string;
  location: string;
  job_link: string;
  status: ApplicationStatus;
  date_applied: string | null;
  deadline: string | null;
  interview_date: string | null;
  notes: string;
  next_action: string;
};

const statuses: FilterStatus[] = [
  "All",
  "Saved",
  "Applied",
  "Technical Assessment",
  "Interview",
  "Rejected",
  "Offer",
];

const applicationColumns = `
  id,
  company,
  role,
  location,
  job_link,
  status,
  date_applied,
  deadline,
  interview_date,
  notes,
  next_action
`;

function databaseToApplication(
  application: DatabaseApplication
): InternshipApplication {
  return {
    id: application.id,
    company: application.company,
    role: application.role,
    location: application.location,
    jobLink: application.job_link,
    status: application.status,
    dateApplied: application.date_applied ?? "",
    deadline: application.deadline ?? "",
    interviewDate: application.interview_date ?? undefined,
    notes: application.notes,
    nextAction: application.next_action,
  };
}

function applicationToDatabase(application: InternshipApplication) {
  return {
    company: application.company,
    role: application.role,
    location: application.location,
    job_link: application.jobLink,
    status: application.status,
    date_applied: application.dateApplied || null,
    deadline: application.deadline || null,
    interview_date: application.interviewDate || null,
    notes: application.notes,
    next_action: application.nextAction,
  };
}

function App() {
  const [selectedStatus, setSelectedStatus] =
    useState<FilterStatus>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [applicationsLoading, setApplicationsLoading] = useState(true);

  const [applicationToEdit, setApplicationToEdit] =
    useState<InternshipApplication | null>(null);

  const [applications, setApplications] =
    useState<InternshipApplication[]>([]);

  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) {
        return;
      }

      if (error) {
        console.error("Error getting session:", error);
      }

      setSession(data.session);

      if (!data.session) {
        setApplicationsLoading(false);
      }

      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);

      if (event === "SIGNED_OUT") {
        setApplications([]);
        setApplicationsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) {
      setApplications([]);
      setApplicationsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadApplications() {
      setApplicationsLoading(true);

      const { data, error } = await supabase
        .from("applications")
        .select(applicationColumns)
        .order("created_at", { ascending: false });

      if (cancelled) {
        return;
      }

      if (error) {
        console.error("Error loading applications:", error);
        alert("There was a problem loading your applications.");
        setApplications([]);
        setApplicationsLoading(false);
        return;
      }

      const databaseApplications =
        (data ?? []) as DatabaseApplication[];

      setApplications(
        databaseApplications.map(databaseToApplication)
      );

      setApplicationsLoading(false);
    }

    loadApplications();

    return () => {
      cancelled = true;
    };
  }, [session?.user.id]);

  const normalizedSearchTerm = searchTerm.toLowerCase().trim();

  const filteredApplications = applications.filter((application) => {
    const matchesStatus =
      selectedStatus === "All" ||
      application.status === selectedStatus;

    const matchesSearch =
      normalizedSearchTerm === "" ||
      application.company
        .toLowerCase()
        .includes(normalizedSearchTerm) ||
      application.role
        .toLowerCase()
        .includes(normalizedSearchTerm) ||
      application.location
        .toLowerCase()
        .includes(normalizedSearchTerm);

    return matchesStatus && matchesSearch;
  });

  async function handleAddApplication(
    newApplication: InternshipApplication
  ) {
    const { data, error } = await supabase
      .from("applications")
      .insert(applicationToDatabase(newApplication))
      .select(applicationColumns);

    if (error) {
      console.error("Error adding application:", error);
      alert("There was a problem saving the application.");
      return;
    }

    if (!data || data.length === 0) {
      alert("The application was not returned by Supabase.");
      return;
    }

    const savedApplication = databaseToApplication(
      data[0] as DatabaseApplication
    );

    setApplications((currentApplications) => [
      savedApplication,
      ...currentApplications,
    ]);
  }

  function handleEditApplication(
    application: InternshipApplication
  ) {
    setApplicationToEdit(application);
    setIsFormOpen(true);
  }

  async function handleUpdateApplication(
    updatedApplication: InternshipApplication
  ) {
    const { data, error } = await supabase
      .from("applications")
      .update(applicationToDatabase(updatedApplication))
      .eq("id", updatedApplication.id)
      .select(applicationColumns);

    if (error) {
      console.error("Error updating application:", error);
      alert("There was a problem updating the application.");
      return;
    }

    if (!data || data.length === 0) {
      alert("The updated application was not returned by Supabase.");
      return;
    }

    const savedApplication = databaseToApplication(
      data[0] as DatabaseApplication
    );

    setApplications((currentApplications) =>
      currentApplications.map((application) =>
        application.id === savedApplication.id
          ? savedApplication
          : application
      )
    );

    setApplicationToEdit(null);
  }

  function handleCloseForm() {
    setIsFormOpen(false);
    setApplicationToEdit(null);
  }

  async function handleDeleteApplication(id: number) {
    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting application:", error);
      alert("There was a problem deleting the application.");
      return;
    }

    setApplications((currentApplications) =>
      currentApplications.filter(
        (application) => application.id !== id
      )
    );
  }

  const bypassLogin = false;

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!session && !bypassLogin) {
    return <Auth />;
  }

  if (applicationsLoading) {
    return <p>Loading applications...</p>;
  }

  return (
    <>
      <header className="top-header">
        <h1>Personal Internship Tracker</h1>

        <button
          className="secondary-button logout-button"
          onClick={() => supabase.auth.signOut()}
        >
          Log Out
        </button>
      </header>

      <main className="app">
        <section className="tracker-section">
          <div className="section-header">
            <div className="section-title-actions">
              <h2>Applications</h2>

              <button
                className="primary-button"
                onClick={() => {
                  setApplicationToEdit(null);
                  setIsFormOpen(true);
                }}
              >
                Add +
              </button>
            </div>

            <div className="tracker-controls">
              <input
                className="search-input"
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />

              <select
                value={selectedStatus}
                onChange={(event) =>
                  setSelectedStatus(
                    event.target.value as FilterStatus
                  )
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