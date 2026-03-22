import React from "react";

const SectionIntro = ({ title, description }) => {
  return (
    <div className="app-card mb-6 p-6 text-center sm:p-8">
      <h2 className="app-heading">{title}</h2>
      {description ? <p className="app-subheading mt-3">{description}</p> : null}
    </div>
  );
};

export default SectionIntro;
