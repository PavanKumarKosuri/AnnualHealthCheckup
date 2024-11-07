/* eslint-disable no-unused-vars */
import React from "react";

const FAQ = () => {
  const faqs = [
    {
      question: "How do I upload employee data?",
      answer:
        "You can upload employee data using the 'Employees' tab. Click on 'Add Employee', fill out the required details, and submit the form.",
    },
    {
      question: "How do I download reports?",
      answer:
        "You can download reports from the 'Reports' tab. Simply search for the desired report, click on the 'Download' button next to it, and the report will be saved to your device.",
    },
    {
      question: "How do I manage HR data?",
      answer:
        "You can manage HR data under the 'HR Management' tab. Here, you can add, edit, or delete HR information. Click on the 'Edit' button to modify HR details or 'Delete' to remove an HR entry.",
    },
    {
      question: "How do I view employees under a specific HR?",
      answer:
        "In the 'HR Management' tab, click on the HR's name to view all employees managed by that HR. A modal will appear displaying the list of employees.",
    },
    {
      question: "How do I update an employee's status?",
      answer:
        "Go to the 'Employee Overview' tab, select the employee whose status you want to update, and click on 'Update Status'. You can choose between 'Active', 'Inactive', or 'Closed'.",
    }
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
