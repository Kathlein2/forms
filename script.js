# /*

# GOOGLE APPS SCRIPT API URL

*/

const API_URL =
"https://script.google.com/macros/s/AKfycbwteS3MTFduPotMBbxFcOE2QNtIs5ReDEpWQrdiB6EbZXGcuULxGGs9K9GhxEdRpA41oA/exec";

# /*

# LOCAL DATA

*/

let records = [];

let editMode = false;

# /*

# LOAD RECORDS

*/

async function loadRecords() {

try {

```
document.getElementById(
  "tableBody"
).innerHTML = `
  <tr>
    <td colspan="7" class="loading">
      Loading records...
    </td>
  </tr>
`;


const response =
  await fetch(
    API_URL + "?action=getRecords"
  );


if (!response.ok) {

  throw new Error(
    "API request failed: " +
    response.status
  );

}


const result =
  await response.json();


if (!result.success) {

  throw new Error(
    result.message ||
    "Unable to load records."
  );

}


records =
  result.data || [];


displayRecords(records);
```

}

catch (error) {

```
console.error(error);

document.getElementById(
  "tableBody"
).innerHTML = `
  <tr>
    <td colspan="7" class="loading">
      Error loading records.
    </td>
  </tr>
`;

showMessage(
  error.message,
  "error"
);
```

}

}

# /*

# DISPLAY RECORDS

*/

function displayRecords(data) {

const tableBody =
document.getElementById(
"tableBody"
);

const recordCount =
document.getElementById(
"recordCount"
);

recordCount.textContent =
data.length +
(
data.length === 1
? " record"
: " records"
);

if (data.length === 0) {

```
tableBody.innerHTML = `
  <tr>
    <td colspan="7" class="loading">
      No records found.
    </td>
  </tr>
`;

return;
```

}

tableBody.innerHTML =
data.map(
function(record) {

```
    return `

      <tr>

        <td>
          ${escapeHtml(record.name)}
        </td>

        <td>
          ${escapeHtml(record.email)}
        </td>

        <td>
          ${escapeHtml(record.phone)}
        </td>

        <td>
          ${escapeHtml(record.status)}
        </td>

        <td>
          ${escapeHtml(record.createdAt)}
        </td>

        <td>
          ${escapeHtml(record.updatedAt || "")}
        </td>

        <td>

          <button
            class="btn-edit"
            onclick="editRecord('${record.id}')"
          >
            Edit
          </button>

          <button
            class="btn-delete"
            onclick="deleteRecord('${record.id}')"
          >
            Delete
          </button>

        </td>

      </tr>

    `;

  }
).join("");
```

}

# /*

# CREATE / UPDATE FORM

*/

document
.getElementById("recordForm")
.addEventListener(
"submit",
async function(event) {

```
  event.preventDefault();


  const data = {

    id:
      document.getElementById(
        "recordId"
      ).value,

    name:
      document.getElementById(
        "name"
      ).value.trim(),

    email:
      document.getElementById(
        "email"
      ).value.trim(),

    phone:
      document.getElementById(
        "phone"
      ).value.trim(),

    status:
      document.getElementById(
        "status"
      ).value

  };


  if (!data.name) {

    showMessage(
      "Name is required.",
      "error"
    );

    return;

  }


  try {

    let action =
      editMode
        ? "updateRecord"
        : "createRecord";


    const response =
      await fetch(
        API_URL,
        {

          method: "POST",

          headers: {
            "Content-Type":
              "text/plain;charset=utf-8"
          },

          body: JSON.stringify({

            action: action,

            data: data

          })

        }
      );


    const result =
      await response.json();


    if (!result.success) {

      throw new Error(
        result.message ||
        "Operation failed."
      );

    }


    showMessage(
      result.message,
      "success"
    );


    resetForm();


    await loadRecords();

  }

  catch (error) {

    console.error(error);

    showMessage(
      error.message,
      "error"
    );

  }

}
```

);

# /*

# EDIT RECORD

*/

function editRecord(id) {

const record =
records.find(
function(item) {

```
    return String(item.id) ===
      String(id);

  }
);
```

if (!record) {

```
showMessage(
  "Record not found.",
  "error"
);

return;
```

}

editMode = true;

document.getElementById(
"recordId"
).value =
record.id;

document.getElementById(
"name"
).value =
record.name || "";

document.getElementById(
"email"
).value =
record.email || "";

document.getElementById(
"phone"
).value =
record.phone || "";

document.getElementById(
"status"
).value =
record.status || "Active";

document.getElementById(
"formTitle"
).textContent =
"Edit Record";

document.getElementById(
"submitButton"
).textContent =
"Update Record";

window.scrollTo({

```
top: 0,

behavior: "smooth"
```

});

}

# /*

# DELETE RECORD

*/

async function deleteRecord(id) {

const record =
records.find(
function(item) {

```
    return String(item.id) ===
      String(id);

  }
);
```

if (!record) {

```
return;
```

}

const confirmed =
confirm(
"Delete " +
record.name +
"?"
);

if (!confirmed) {

```
return;
```

}

try {

```
const response =
  await fetch(
    API_URL,
    {

      method: "POST",

      headers: {
        "Content-Type":
          "text/plain;charset=utf-8"
      },

      body: JSON.stringify({

        action:
          "deleteRecord",

        id:
          id

      })

    }
  );


const result =
  await response.json();


if (!result.success) {

  throw new Error(
    result.message ||
    "Delete failed."
  );

}


showMessage(
  result.message,
  "success"
);


await loadRecords();
```

}

catch (error) {

```
console.error(error);

showMessage(
  error.message,
  "error"
);
```

}

}

# /*

# RESET FORM

*/

function resetForm() {

document
.getElementById(
"recordForm"
)
.reset();

document.getElementById(
"recordId"
).value = "";

document.getElementById(
"status"
).value =
"Active";

editMode = false;

document.getElementById(
"formTitle"
).textContent =
"Add Record";

document.getElementById(
"submitButton"
).textContent =
"Add Record";

}

# /*

# SEARCH

*/

function filterRecords() {

const search =
document.getElementById(
"search"
).value
.toLowerCase()
.trim();

const filtered =
records.filter(
function(record) {

```
    return (

      String(record.name)
        .toLowerCase()
        .includes(search)

      ||

      String(record.email)
        .toLowerCase()
        .includes(search)

      ||

      String(record.phone)
        .toLowerCase()
        .includes(search)

      ||

      String(record.status)
        .toLowerCase()
        .includes(search)

    );

  }
);
```

displayRecords(
filtered
);

}

# /*

# MESSAGE

*/

function showMessage(
message,
type
) {

const element =
document.getElementById(
"message"
);

element.textContent =
message;

element.className =
"message " + type;

setTimeout(
function() {

```
  element.className =
    "message";

},
4000
```

);

}

# /*

# SECURITY

*/

function escapeHtml(value) {

return String(
value || ""
)

```
.replace(
  /&/g,
  "&amp;"
)

.replace(
  /</g,
  "&lt;"
)

.replace(
  />/g,
  "&gt;"
)

.replace(
  /"/g,
  "&quot;"
)

.replace(
  /'/g,
  "&#039;"
);
```

}

# /*

# START APPLICATION

*/

document.addEventListener(
"DOMContentLoaded",
function() {

```
loadRecords();
```

}
);
