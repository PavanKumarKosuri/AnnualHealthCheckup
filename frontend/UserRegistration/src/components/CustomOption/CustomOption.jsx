// src/components/CustomOption/CustomOption.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import styles from "./CustomOption.module.css";
const CustomOption = ({ innerProps, innerRef, data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fixAndParseDescription = (description) => {
    let cleanedDescription = description.replace(/[\n\r]/g, "").trim();

    cleanedDescription = cleanedDescription.replace(/,(\s*[}\]])/g, "$1");
    cleanedDescription = cleanedDescription.replace(/([\[{])\s*,/g, "$1");

    if (!cleanedDescription.startsWith("[")) {
      cleanedDescription = "[" + cleanedDescription;
    }
    if (!cleanedDescription.endsWith("]")) {
      cleanedDescription = cleanedDescription + "]";
    }

    try {
      const parsedDescription = JSON.parse(cleanedDescription);
      return parsedDescription;
    } catch (error) {
      console.error("Error parsing description:", error);
      return null;
    }
  };

  const renderDescriptionList = (items) => {
    const listItems = [];
    let currentItem = null;
    items.forEach((item) => {
      if (item.startsWith("-")) {
        if (currentItem) {
          if (!currentItem.subItems) {
            currentItem.subItems = [];
          }
          currentItem.subItems.push(item.substring(1).trim());
        }
      } else {
        currentItem = { text: item, subItems: [] };
        listItems.push(currentItem);
      }
    });
    return (
      <ul className={styles.descriptionList}>
        {listItems.map((item, index) => (
          <li key={index}>
            {item.text}
            {item.subItems && item.subItems.length > 0 && (
              <ul className={styles.nestedListItem}>
                {item.subItems.map((subItem, subIndex) => (
                  <li key={subIndex}>{subItem}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div {...innerProps} ref={innerRef} className={styles.customOption}>
      <span>{data.label}</span>
      <button
        type="button"
        className={styles.viewButton}
        onClick={(e) => {
          e.stopPropagation();
          setIsModalOpen(true);
        }}
        aria-label={`View details of ${data.label}`}
      >
        View
      </button>
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>{data.label} Details</h3>
            {data.description ? (
              <div className={styles.packageDescription}>
                {(() => {
                  const parsedDescription = fixAndParseDescription(
                    data.description
                  );
                  if (
                    parsedDescription &&
                    Array.isArray(parsedDescription)
                  ) {
                    return renderDescriptionList(parsedDescription);
                  } else {
                    return <p>{data.description}</p>;
                  }
                })()}
              </div>
            ) : (
              <p>No description available.</p>
            )}
            <button
              type="button"
              className={styles.closeModalBtn}
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

CustomOption.propTypes = {
  innerProps: PropTypes.object.isRequired,
  innerRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
};

export default CustomOption;
