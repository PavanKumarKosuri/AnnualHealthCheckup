/* eslint-disable no-unused-vars */
import React from "react";

const Documentation = () => {
  const docs = [
    {
      title: "Vendor User Guide",
      url: "https://example.com/vendor-user-guide",
    },
    {
      title: "How to Upload Test Results",
      url: "https://example.com/upload-results-guide",
    },
    {
      title: "Report Management Guide",
      url: "https://example.com/report-management",
    },
    // Add more vendor-specific documentation links
  ];

  return (
    <div className="documentation-section">
      <h5>Documentation</h5>
      <ul className="list-group">
        {docs.map((doc, index) => (
          <li key={index} className="list-group-item">
            <a href={doc.url} target="_blank" rel="noopener noreferrer">
              {doc.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Documentation;
