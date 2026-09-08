import { useEffect, useState } from "react";
import "./App.css";

import {
  getJobs,
  createJob,
  updateJob,
  deleteJob
} from "./services/jobService";


function App() {


  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");

  const [jobs, setJobs] = useState([]);

  const [editingJobId, setEditingJobId] = useState(null);

  const [error, setError] = useState("");



  useEffect(() => {

    const loadJobs = async () => {

      try {

        const data = await getJobs();

        setJobs(data);

      } catch (error) {

        console.error("Error fetching jobs:", error);

        setError("Failed to load jobs.");

      }

    };

    loadJobs();

  }, []);



  const handleSubmit = async (e) => {

    e.preventDefault();




    if (!company || !role || !status) {

      setError("Please fill in all fields.");

      return;
    }


    setError("");


    const jobData = {
      company,
      role,
      status
    };


    try {



      if (editingJobId === null) {

        const data = await createJob(jobData);

        setJobs((currentJobs) => [
          ...currentJobs,
          data
        ]);

      }




      else {

        const updatedJob = await updateJob(
          editingJobId,
          jobData
        );


        setJobs((currentJobs) =>
          currentJobs.map((job) =>
            job.id === editingJobId
              ? updatedJob
              : job
          )
        );


        setEditingJobId(null);

      }




      setCompany("");
      setRole("");
      setStatus("Applied");


    } catch (error) {

      console.error("Error saving job:", error);

      setError(
        error.message || "Something went wrong."
      );

    }

  };




  const handleDelete = async (id) => {

    try {

      await deleteJob(id);


      setJobs((currentJobs) =>
        currentJobs.filter(
          (job) => job.id !== id
        )
      );


    } catch (error) {

      console.error(
        "Error deleting job:",
        error
      );

    }

  };




  const handleEdit = (job) => {

    setEditingJobId(job.id);

    setCompany(job.company);

    setRole(job.role);

    setStatus(job.status);

  };




  return (

    <div className="app">



      <div className="title">

        <h1>Job Tracker</h1>

        <p>
          Keep track of your job applications
        </p>

      </div>




      <form
        className="job-form"
        onSubmit={handleSubmit}
      >

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}


        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) =>
            setCompany(e.target.value)
          }
        />


        <input
          type="text"
          placeholder="Job Role"
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
        />


        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >

          <option value="Applied">
            Applied
          </option>

          <option value="Interview">
            Interview
          </option>

          <option value="Rejected">
            Rejected
          </option>

          <option value="Offer">
            Offer
          </option>

          <option value="Accepted">
            Accepted
          </option>

        </select>


        <button type="submit">

          {editingJobId === null
            ? "Add Job"
            : "Update Job"}

        </button>

      </form>




      <section className="jobs-section">

        <h2>My Jobs</h2>


        <div className="jobs-list">

          {jobs.map((job) => (

            <div
              className="job-card"
              key={job.id}
            >


              <div className="job-info">

                <h3>{job.company}</h3>

                <p>{job.role}</p>

              </div>



              <div className="job-actions">

                <span className="status">
                  {job.status}
                </span>


                <button
                  className="edit-button"
                  onClick={() =>
                    handleEdit(job)
                  }
                >
                  Edit
                </button>


                <button
                  className="delete-button"
                  onClick={() =>
                    handleDelete(job.id)
                  }
                >
                  Delete
                </button>

              </div>


            </div>

          ))}

        </div>

      </section>


    </div>

  );

}


export default App;