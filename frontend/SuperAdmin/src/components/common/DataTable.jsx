import React from "react";
import EditEntryForm from "./EditEntryForm";

const DataTable = ({
  data,
  columns,
  isEditing,
  currentEdit,
  handleEditChange,
  handleSave,
  formFields,
  actionButton, // Add this prop
}) => {
  return (
    <table className="table table-hover table-striped table-sm">
      <thead className="table-light">
        <tr>
          {columns.map((col) => (
            <th key={col.accessor}>{col.header}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((entry) => (
          <tr key={entry.id}>
            {isEditing && currentEdit && currentEdit.id === entry.id ? (
              <EditEntryForm
                entry={currentEdit}
                handleEditChange={handleEditChange}
                handleSave={handleSave}
                formFields={formFields}
              />
            ) : (
              <>
                {columns.map((col) => (
                  <td key={col.accessor}>{entry[col.accessor]}</td>
                ))}
                <td>
                  {actionButton && actionButton(entry)}{" "}
                  {/* Use the actionButton prop here */}
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
