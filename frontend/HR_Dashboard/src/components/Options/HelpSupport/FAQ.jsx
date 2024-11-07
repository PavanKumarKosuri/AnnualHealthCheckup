/* eslint-disable no-unused-vars */
import React from "react";

const FAQ = () => {
  const faqs = [
    {
      question: "How do I upload employee data?",
      answer: "You can upload employee data using the 'Employees' tab...",
    },
    {
      question: "How do I download reports?",
      answer: "You can download reports from the 'ReportsDownload' tab...",
    },
    // Add more FAQs here
  ];

  return (
    <div className="faq-section">
      {faqs.map((faq, index) => (
        <div key={index} className="mb-3">
          <h5>{faq.question}</h5>
          <p>{faq.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default FAQ;
