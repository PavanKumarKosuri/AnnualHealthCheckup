// superAdmin/src/components/SuperAdmin/Options/Reports/commonFunctions.js
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

// Handle Input Change for Filters
export const handleInputChange = (e, setState) => {
  const { name, value } = e.target;
  setState((prev) => ({
    ...prev,
    [name]: value,
  }));
};

// Handle Input Change for Editing Users
export const handleEditInputChange = (
  e,
  setCurrentEdit,
  packageId = null,
  subPackageId = null
) => {
  const { name, value } = e.target;

  if (packageId && subPackageId) {
    setCurrentEdit((prev) => ({
      ...prev,
      packages: prev.packages.map((pkg) =>
        pkg.id === packageId
          ? {
              ...pkg,
              subpackages: pkg.subpackages.map((subpkg) =>
                subpkg.id === subPackageId
                  ? { ...subpkg, [name]: value }
                  : subpkg
              ),
            }
          : pkg
      ),
    }));
  } else if (packageId) {
    setCurrentEdit((prev) => ({
      ...prev,
      packages: prev.packages.map((pkg) =>
        pkg.id === packageId ? { ...pkg, [name]: value } : pkg
      ),
    }));
  } else {
    setCurrentEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

// Handle Input Change for Adding Users
export const handleAddInputChange = (e, setState) => {
  const { name, value } = e.target;
  setState((prev) => ({
    ...prev,
    [name]: value,
  }));
};

// Download Users as Excel File
export const downloadExcel = (data, fileName) => {
  if (data.length > 0) {
    const headers = Object.keys(data[0]);
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: "A1" });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    XLSX.writeFile(workbook, fileName);
  } else {
    toast.error("No data available to export.");
    console.error("No data available to export");
  }
};
