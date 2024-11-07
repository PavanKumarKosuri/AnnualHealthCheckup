/* eslint-disable no-unused-vars */
import React from "react";

const Documentation = () => {
  const docs = [
    {
      title: "User Guide",
      url: "https://example.com/user-guide",
    },
    {
      title: "How to Upload Employee Data",
      url: "https://example.com/upload-guide",
    },
    {
      title: "FAQ Document",
      url: "https://example.com/faq",
    },
    // Add more documentation links here
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
