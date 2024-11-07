// src/components/common/FilterForm.jsx

import React from "react";

const FilterForm = ({
  filters,
  handleInputChange,
  handleFilter,
  handleClearFilters,
  filterFields,
}) => {
  return (
    <div className="card card-body">
      <div className="row mb-3">
        {filterFields.map((field) => (
          <div className="col-md-4 mb-3" key={field.name}>
            {field.type === "select" ? (
              <select
                className="form-select"
                name={field.name}
                value={filters[field.name] || ""}
                onChange={(e) => handleInputChange(e, field.setFilter)}
                aria-label={field.placeholder}
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
                placeholder={field.placeholder}
                name={field.name}
                value={filters[field.name] || ""}
                onChange={(e) => handleInputChange(e, field.setFilter)}
              />
            )}
          </div>
        ))}
      </div>
      <div className="row">
        <div className="col">
          <button className="btn btn-outline-dark me-2" onClick={handleFilter}>
            Apply Filters
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={handleClearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterForm;
