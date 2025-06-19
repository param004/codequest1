import React from "react";

const Profilebio = ({ currentprofile }) => {
  return (
    <div className="profile-info-card">
      <h2>About</h2>
      <p>{currentprofile.about && currentprofile.about.trim() !== "" ? currentprofile.about : "No bio yet."}</p>
      <h3>Watched Tags</h3>
      <span>
        {Array.isArray(currentprofile.tags) && currentprofile.tags.length > 0
          ? currentprofile.tags.join(", ")
          : "No tags yet."}
      </span>
    </div>
  );
};

export default Profilebio;