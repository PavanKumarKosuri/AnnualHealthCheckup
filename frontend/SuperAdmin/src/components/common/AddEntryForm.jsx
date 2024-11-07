// src/components/common/AddEntryForm.jsx

import React from "react";

const AddEntryForm = ({ newEntry, setNewEntry, handleAdd, formFields }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="card card-body">
      <form>
        {formFields.map((field) => (
          <div className="form-group mb-3" key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>
            {field.type === "select" ? (
              <select
                className="form-select"
                name={field.name}
                value={newEntry[field.name]}
                onChange={handleChange}
                required={field.required}
              >
                <option value="">{field.placeholder}</option>
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                className="form-control"
                name={field.name}
                value={newEntry[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                required={field.required}
              />
            )}
          </div>
        ))}
      </form>
      <div className="d-flex">
        <button className="btn btn-outline-dark me-2" onClick={handleAdd}>
          Confirm Add
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={() => setNewEntry({})}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default AddEntryForm;
