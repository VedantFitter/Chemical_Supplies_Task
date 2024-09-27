let selectedRow = null;
const tableBody = document.getElementById("tableBody");

const sampleData = [
  { id: 1, name: "Ammonium Persulfate", vendor: "LG Chem", density: "3525.92", viscosity: "60.63", packaging: "Bag", packSize: "100.00", unit: "kg", quantity: "6495.18" },
  { id: 2, name: "Caustic Potash", vendor: "Formosa", density: "3172.15", viscosity: "48.22", packaging: "Bag", packSize: "100.00", unit: "kg", quantity: "8751.90" },
  { id: 3, name: "Dimethylaminopropylamino", vendor: "LG Chem", density: "8435.37", viscosity: "12.62", packaging: "Barrel", packSize: "75.00", unit: "L", quantity: "5964.61" },
  { id: 4, name: "Mono Ammonium Phosphate", vendor: "Sinopec", density: "1597.65", viscosity: "92.64", packaging: "Bag", packSize: "105.00", unit: "kg", quantity: "8183.73" },
  { id: 5, name: "Ferric Nitrate", vendor: "DowDuPont", density: "364.04", viscosity: "44.33", packaging: "Bag", packSize: "105.00", unit: "kg", quantity: "4154.33" },
  { id: 6, name: "n-Pentane", vendor: "Sinopec", density: "4535.26", viscosity: "66.76", packaging: "N/A", packSize: "N/A", unit: "t", quantity: "6272.34" },
  { id: 7, name: "Glycol Ether PM", vendor: "LG Chem", density: "6495.18", viscosity: "72.12", packaging: "Bag", packSize: "250.00", unit: "kg", quantity: "8749.54" },
];

// Initialize table with data
function populateTable() {
  tableBody.innerHTML = "";   // Clear table body

  // Check if saved data exists in localStorage
  const savedData = JSON.parse(localStorage.getItem("tableData"));

  if (savedData && savedData.length > 0) {
    savedData.forEach((rowData) => addRow(rowData));
  } else {       // If no saved data, populate with sample data
    sampleData.forEach((data) => {
      const rowData = [data.id, data.name, data.vendor, data.density, data.viscosity, data.packaging, data.packSize, data.unit, data.quantity,
      ];
      addRow(rowData);
    });
  }
  toggleButtons();    // Disable buttons initially
}

// Add new row (either from saved data or an empty row for user input)
function addRow(rowData = []) {
  const row = document.createElement("tr");
  // Define the fields that will be editable in the table
  const fields = [ "id", "name", "vendor", "density", "viscosity", "packaging", "packSize", "unit", "quantity"];

  // Create the check icon
  const checkIcon = document.createElement("i");
  checkIcon.className = "fa-solid fa-check"; // Use Font Awesome check icon
  checkIcon.style.color = "gray"; // Default color

  // Create a cell for the check icon
  const checkCell = document.createElement("td");
  checkCell.appendChild(checkIcon);
  row.appendChild(checkCell); // Append check cell to row

  // Loop through each field and create editable cells
  fields.forEach((field, index) => {
    const cell = document.createElement("td");
    cell.contentEditable = true;                //taken help from stackoverflow (https://stackoverflow.com/questions/6012823/how-to-make-html-table-cell-editable)
    cell.textContent = rowData[index] || "";    // Use saved data or leave empty
    row.appendChild(cell);
  });

  tableBody.appendChild(row);         // Append the new row to the table body

  row.addEventListener("click", () => selectRow(row, checkIcon));      // Add event listener to select the row on click

  toggleButtons();    // Update buttons after adding a row
}

// Disable/Enable buttons based on selection and row position
function toggleButtons() {
  const moveUpBtn = document.getElementById("moveUpBtn");
  const moveDownBtn = document.getElementById("moveDownBtn");
  const deleteRowBtn = document.getElementById("deleteRowBtn");

  const isRowSelected = selectedRow !== null;
  deleteRowBtn.disabled = !isRowSelected;


    // Change icon color based on disabled status
  const deleteIcon = deleteRowBtn.querySelector("i");
  if (deleteRowBtn.disabled) {
      deleteIcon.style.color = "gray";     // Change to gray when disabled
    } else {
      deleteIcon.style.color = "red";     // Change to red (or any other color) when enabled
    }

  if (isRowSelected) {
    // Enable/Disable the Move Up button based on whether there is a row above
    moveUpBtn.disabled = !selectedRow.previousElementSibling;

    // Enable/Disable the Move Down button based on whether there is a row below
    moveDownBtn.disabled = !selectedRow.nextElementSibling;
  } else {
    // Disable both Move buttons if no row is selected
    moveUpBtn.disabled = true;
    moveDownBtn.disabled = true;
  }
}

function selectRow(row, checkIcon) {
  // Deselect the previously selected row
  if (selectedRow) {
    const prevCheckIcon = selectedRow.firstChild.firstChild; // Get the check icon of the previous row
    prevCheckIcon.style.color = "gray"; // Change color back to gray

    // Reset the background color of all children in the previous row
    Array.from(selectedRow.children).forEach(function (child) {
      child.style.backgroundColor = "white"; // Change background color back to white
    });

    selectedRow.classList.remove("selected");
  }

  // Select the current row
  selectedRow = row;
  selectedRow.classList.add("selected");

  // Change the check icon color to blue
  checkIcon.style.color = "blue";

  // Set the background color of all children in the selected row to purple
  Array.from(selectedRow.children).forEach(function (child) {
    child.style.backgroundColor = "rgb(220 227 255)"; // Change background color to purple
  });

  toggleButtons(); // Enable buttons after row selection
}

// Save the current table data to localStorage
function saveTable() {
  const rowsData = [];
  const rows = Array.from(tableBody.rows);

  rows.forEach((row) => {
    const cells = Array.from(row.cells).slice(1);    // Skip the check icon cell
    const rowData = cells.map((cell) => cell.textContent.trim());   // Get text from each cell
    rowsData.push(rowData);
  });

  // Save the table data to localStorage (as JSON)
  localStorage.setItem("tableData", JSON.stringify(rowsData));

  alert("Table data saved successfully!");
}

// Refresh the table data from localStorage
function refreshTable() {
  const savedData = JSON.parse(localStorage.getItem("tableData"));

  if (savedData) {
    tableBody.innerHTML = ""; // Clear the table
    savedData.forEach((rowData) => {
      addRow(rowData);
    });
    setTimeout(()=>alert("Table refreshed successfully!") ,500)
    
  } else {
    setTimeout(()=>alert("No saved data found to refresh!"),500);
  }
}

// Attach event listeners to buttons
document.getElementById("addRowBtn").addEventListener("click", () => addRow());
document.getElementById("deleteRowBtn").addEventListener("click", () => {
  if (selectedRow) {
    selectedRow.remove(); // Remove the selected row
    selectedRow = null; // Reset selectedRow to null
    toggleButtons(); // Disable buttons after deletion
  }
});
document.getElementById("moveUpBtn").addEventListener("click", () => {
  if (selectedRow && selectedRow.previousElementSibling) {
    selectedRow.parentNode.insertBefore(
      selectedRow,
      selectedRow.previousElementSibling
    ); // Move the row up
    toggleButtons(); // Update buttons after row moves
  }
});
document.getElementById("moveDownBtn").addEventListener("click", () => {
  if (selectedRow && selectedRow.nextElementSibling) {
    selectedRow.parentNode.insertBefore(
      selectedRow.nextElementSibling,
      selectedRow
    ); // Move the row down
    toggleButtons(); // Update buttons after row moves
  }
});

// Attach save and refresh buttons
document.getElementById("saveBtn").addEventListener("click", saveTable);
document.getElementById("refreshBtn").addEventListener("click", refreshTable);

// Sorting functionality
const sortDirections = Array.from({ length: 10 }, () => true); // Keep track of sort directions (ascending)

function sortTable(columnIndex) {         //source-https://stackoverflow.com/questions/14267781/sorting-html-table-with-javascript and openai
  const rows = Array.from(tableBody.rows);
  const ascending = sortDirections[columnIndex]; // Get the current sort direction

  rows.sort((rowA, rowB) => {
    const cellA = rowA.cells[columnIndex].textContent.trim();
    const cellB = rowB.cells[columnIndex].textContent.trim();

    if (!isNaN(cellA) && !isNaN(cellB)) {
      // If cells are numeric
      return ascending ? cellA - cellB : cellB - cellA;
    } else {
      // If cells are strings
      return ascending
        ? cellA.localeCompare(cellB)
        : cellB.localeCompare(cellA);
    }
  });

  // Toggle sort direction for the next click
  sortDirections[columnIndex] = !ascending;

  // Append sorted rows to the table body
  tableBody.append(...rows);
}

// Load initial table data on page load
populateTable();