/* eslint-disable no-unused-vars */
import React from "react";

const FAQ = () => {
  const faqs = [
    {
      question: "How do I upload test results?",
      answer: "You can upload test results via the 'Sample Management' tab...",
    },
    {
      question: "How do I manage reports?",
      answer: "You can manage reports from the 'Reports' tab...",
    },
    // Add more FAQs specific to the vendor operations
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
