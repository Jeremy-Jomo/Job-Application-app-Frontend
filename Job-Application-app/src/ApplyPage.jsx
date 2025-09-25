import React from "react";
import { useParams } from "react-router-dom";
import ApplicationForm from "./ApplicationForm";

function ApplyPage() {
  const { id } = useParams(); // 👈 jobId from URL

  return (
    <div>
      {/* <h1>Apply for Job #{id}</h1> */}
      <ApplicationForm jobId={id} />
    </div>
  );
}

export default ApplyPage;
