import React from "react";

const EditEntryForm = ({ entry, handleEditChange, handleSave, formFields }) => {
  if (!formFields || formFields.length === 0) {
    console.warn("No form fields provided to EditEntryForm");
    return (
      <td colSpan="2">
        <p>No editable fields available</p>
      </td>
    );
  }

  return (
    <>
      {formFields.map((field) => (
        <td key={field.name}>
          {field.type === "select" ? (
            <select
              className="form-select form-select-sm"
              name={field.name}
              value={entry[field.name] || ""}
              onChange={handleEditChange}
            >
              <option value="">{field.placeholder}</option>
              {field.options &&
                field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>
          ) : (
            <input
              type={field.type || "text"}
              className="form-control form-control-sm"
              name={field.name}
              value={entry[field.name] || ""}
              onChange={handleEditChange}
              placeholder={field.placeholder}
            />
          )}
        </td>
      ))}
      <td>
        <button className="btn btn-outline-primary btn-sm" onClick={handleSave}>
          Save
        </button>
      </td>
    </>
  );
};

EditEntryForm.defaultProps = {
  entry: {},
  handleEditChange: () => console.warn("handleEditChange not provided"),
  handleSave: () => console.warn("handleSave not provided"),
  formFields: [],
};

export default EditEntryForm;
