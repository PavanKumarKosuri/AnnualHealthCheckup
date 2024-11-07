/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "../../styles/styles.css";

const TestimonialManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRegions, setExpandedRegions] = useState({});

  // Dummy data representing different regions and their areas
  const testimonialData = [
    {
      name: "Mumbai",
      areas: [
        {
          name: "Area 1",
          tests: [
            {
              test: "CBC",
              vial: "EDTA PURPLE TOP",
              usage: 120,
              totalRequired: 150,
            },
            {
              test: "ESR",
              vial: "Fluride",
              usage: 100,
              totalRequired: 150,
            },
            {
              test: "Glucose Fasting",
              vial: "PLAIN VIAL RED/YELLOW TOP",
              usage: 15,
              totalRequired: 25,
            },
            {
              test: "Hba1c",
              vial: "Citrate Vial sky blue Top",
              usage: 12,
              totalRequired: 20,
            },
            {
              campArea: "Area 1",
              test: "Lipid Profile",
              vial: "Urine Container",
              usage: 18,
              totalRequired: 28,
            },
            {
              campArea: "Area 1",
              test: "Liver Function Test",
              vial: "Needles",
              usage: 8,
              totalRequired: 10,
            },
            {
              campArea: "Area 1",
              test: "Kidney Function Test",
              vial: "Vacutainer",
              usage: 5,
              totalRequired: 8,
            },
          ],
        },
        {
          name: "Area 2",
          tests: [
            {
              test: "Glucose Fasting",
              vial: "PLAIN VIAL RED/YELLOW TOP",
              usage: 90,
              totalRequired: 100,
            },
            {
              test: "Hba1c",
              vial: "Citrate Vial sky blue Top",
              usage: 85,
              totalRequired: 100,
            },
            {
              test: "CBC",
              vial: "EDTA PURPLE TOP",
              usage: 25,
              totalRequired: 35,
            },
            {
              test: "ESR",
              vial: "Fluride",
              usage: 18,
              totalRequired: 28,
            },
            {
              test: "Glucose Fasting",
              vial: "PLAIN VIAL RED/YELLOW TOP",
              usage: 10,
              totalRequired: 15,
            },
            {
              test: "Hba1c",
              vial: "Citrate Vial sky blue Top",
              usage: 20,
              totalRequired: 30,
            },
            {
              test: "Lipid Profile",
              vial: "Urine Container",
              usage: 15,
              totalRequired: 25,
            },
            {
              test: "Liver Function Test",
              vial: "Needles",
              usage: 9,
              totalRequired: 12,
            },
            {
              test: "Kidney Function Test",
              vial: "Vacutainer",
              usage: 6,
              totalRequired: 9,
            },
          ],
        },
      ],
    },
    {
      name: "Delhi",
      areas: [
        {
          name: "Area 1",
          tests: [
            {
              test: "Lipid Profile",
              vial: "Urine Container",
              usage: 130,
              totalRequired: 150,
            },
            {
              test: "Liver Function Test",
              vial: "Needles",
              usage: 120,
              totalRequired: 150,
            },
            // Add more tests here...
          ],
        },
        {
          name: "Area 2",
          tests: [
            {
              test: "Kidney Function Test",
              vial: "Vacutainer",
              usage: 100,
              totalRequired: 120,
            },
            {
              test: "TFT",
              vial: "Alcohol Swab",
              usage: 110,
              totalRequired: 120,
            },
            // Add more tests here...
          ],
        },
      ],
    },
    {
      name: "Bengaluru",
      areas: [
        {
          name: "Area 1",
          tests: [
            {
              test: "Vitamin D",
              vial: "Tourniquete",
              usage: 95,
              totalRequired: 100,
            },
            {
              test: "Vitamin B12",
              vial: "Cotton",
              usage: 98,
              totalRequired: 100,
            },
            // Add more tests here...
          ],
        },
        {
          name: "Area 2",
          tests: [
            {
              test: "Urine Routine",
              vial: "Hand Sanitiser",
              usage: 105,
              totalRequired: 120,
            },
            {
              test: "Marker",
              vial: "Needles Discarder",
              usage: 110,
              totalRequired: 120,
            },
            // Add more tests here...
          ],
        },
      ],
    },
    {
      name: "Pune",
      areas: [
        {
          name: "Area 1",
          tests: [
            {
              test: "Gloves",
              vial: "Gloves",
              usage: 80,
              totalRequired: 100,
            },
            {
              test: "Face Mask",
              vial: "Face Mask",
              usage: 70,
              totalRequired: 100,
            },
            // Add more tests here...
          ],
        },
        {
          name: "Area 2",
          tests: [
            {
              test: "Garbage Bag",
              vial: "Garbage Bag Red,Yellow,Black",
              usage: 90,
              totalRequired: 100,
            },
            {
              test: "5ml BD Syringe",
              vial: "5ml BD syringe (Emergency Use)",
              usage: 65,
              totalRequired: 70,
            },
            // Add more tests here...
          ],
        },
      ],
    },
    {
      name: "Hyderabad",
      areas: [
        {
          name: "Area 1",
          tests: [
            {
              test: "CBC",
              vial: "EDTA PURPLE TOP",
              usage: 75,
              totalRequired: 90,
            },
            {
              test: "ESR",
              vial: "Fluride",
              usage: 85,
              totalRequired: 90,
            },
            // Add more tests here...
          ],
        },
        {
          name: "Area 2",
          tests: [
            {
              test: "Glucose Fasting",
              vial: "PLAIN VIAL RED/YELLOW TOP",
              usage: 65,
              totalRequired: 80,
            },
            {
              test: "Hba1c",
              vial: "Citrate Vial sky blue Top",
              usage: 60,
              totalRequired: 80,
            },
            // Add more tests here...
          ],
        },
      ],
    },
  ];

  const handleToggleRegion = (region) => {
    setExpandedRegions((prev) => ({
      ...prev,
      [region]: !prev[region],
    }));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredData = testimonialData.filter(
    (region) =>
      region.name.toLowerCase().includes(searchTerm) ||
      region.areas.some((area) => area.name.toLowerCase().includes(searchTerm))
  );

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>Testimonial Management</h3>
      </div>

      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Search camps..."
          aria-label="Search camps"
          aria-describedby="basic-addon2"
          value={searchTerm}
          onChange={handleSearch}
        />
      </InputGroup>

      <Accordion>
        {filteredData.map((region, regionIndex) => (
          <Accordion.Item eventKey={regionIndex.toString()} key={regionIndex}>
            <Accordion.Header>
              <h5 className="mb-0">{region.name}</h5>
            </Accordion.Header>
            <Accordion.Body>
              {region.areas.map((area, areaIndex) => (
                <div key={areaIndex} className="mb-4">
                  <h6>{area.name}</h6>
                  <div className="table-responsive mt-3">
                    <table className="table table-hover table-striped table-sm">
                      <thead>
                        <tr>
                          <th>Test</th>
                          <th>Vial Type</th>
                          <th>Used</th>
                          <th>Total Required</th>
                          <th>Remaining</th>
                        </tr>
                      </thead>
                      <tbody>
                        {area.tests.map((test, testIndex) => (
                          <tr key={testIndex}>
                            <td>{test.test}</td>
                            <td>{test.vial}</td>
                            <td>{test.usage}</td>
                            <td>{test.totalRequired}</td>
                            <td>{test.totalRequired - test.usage}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </main>
  );
};

export default TestimonialManagement;
