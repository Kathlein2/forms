const API_URL =
  "YOUR_APPS_SCRIPT_URL";


let records = [];

let editing = false;


/* =====================================
   LOAD RECORDS
===================================== */

async function loadRecords() {

  try {

    const response =
      await fetch(
        API_URL + "?action=getRecords"
      );

    const result =
      await response.json();

    if (!result.success) {

      throw new Error(
        result.message
      );

    }

    records =
      result.data || [];

    displayRecords(records);

  }

  catch (error) {

    console.error(error);

    showMessage(
      "Error loading records: " +
      error.message,
      "error"
    );

  }

}


/* =====================================
   DISPLAY RECORDS
===================================== */

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

    tableBody.innerHTML = `
      <tr>
        <td
          colspan="7"
          class="loading"
        >
          No records found.
        </td>
      </tr>
    `;

    return;

  }


  tableBody.innerHTML =
    data.map(
      record => `

        <tr>

          <td>
            ${escapeHTML(record.name)}
          </td>

          <td>
            ${escapeHTML(record.email)}
          </td>

          <td>
            ${escapeHTML(record.phone)}
          </td>

          <td>
            ${escapeHTML(record.status)}
          </td>

          <td>
            ${escapeHTML(record.createdAt)}
          </td>

          <td>
            ${escapeHTML(record.updatedAt)}
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

      `
    ).join("");

}


/* =====================================
   ADD / UPDATE RECORD
===================================== */

document
  .getElementById("recordForm")
  .addEventListener(
    "submit",
    async function(event) {

      event.preventDefault();


      const data = {

        id:
          document.getElementById(
            "recordId"
          ).value,

        name:
          document.getElementById(
            "name"
          ).value,

        email:
          document.getElementById(
            "email"
          ).value,

        phone:
          document.getElementById(
            "phone"
          ).value,

        status:
          document.getElementById(
            "status"
          ).value

      };


      const action =
        editing
          ? "updateRecord"
          : "createRecord";


      try {

        const response =
          await fetch(
            API_URL,
            {

              method: "POST",

              headers: {
                "Content-Type":
                  "text/plain;charset=utf-8"
              },

              body:
                JSON.stringify({

                  action:
                    action,

                  data:
                    data

                })

            }
          );


        const result =
          await response.json();


        if (!result.success) {

          throw new Error(
            result.message
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
  );


/* =====================================
   EDIT
===================================== */

function editRecord(id) {

  const record =
    records.find(
      item =>
        String(item.id) ===
        String(id)
    );


  if (!record) {
    return;
  }


  editing = true;


  document.getElementById(
    "recordId"
  ).value =
    record.id;


  document.getElementById(
    "name"
  ).value =
    record.name;


  document.getElementById(
    "email"
  ).value =
    record.email;


  document.getElementById(
    "phone"
  ).value =
    record.phone;


  document.getElementById(
    "status"
  ).value =
    record.status;


  document.getElementById(
    "formTitle"
  ).textContent =
    "Edit Record";


  document.getElementById(
    "submitButton"
  ).textContent =
    "Update Record";


  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

}


/* =====================================
   DELETE
===================================== */

async function deleteRecord(id) {

  const confirmed =
    confirm(
      "Are you sure you want to delete this record?"
    );


  if (!confirmed) {
    return;
  }


  try {

    const response =
      await fetch(
        API_URL,
        {

          method: "POST",

          headers: {
            "Content-Type":
              "text/plain;charset=utf-8"
          },

          body:
            JSON.stringify({

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
        result.message
      );

    }


    showMessage(
      result.message,
      "success"
    );


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


/* =====================================
   RESET FORM
===================================== */

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


  editing = false;


  document.getElementById(
    "formTitle"
  ).textContent =
    "Add Record";


  document.getElementById(
    "submitButton"
  ).textContent =
    "Add Record";

}


/* =====================================
   SEARCH
===================================== */

document
  .getElementById("search")
  .addEventListener(
    "input",
    filterRecords
  );


function filterRecords() {

  const search =
    document.getElementById(
      "search"
    ).value
      .toLowerCase()
      .trim();


  const filtered =
    records.filter(
      record =>

        record.name
          .toLowerCase()
          .includes(search)

        ||

        record.email
          .toLowerCase()
          .includes(search)

        ||

        record.phone
          .toLowerCase()
          .includes(search)

        ||

        record.status
          .toLowerCase()
          .includes(search)

    );


  displayRecords(
    filtered
  );

}


/* =====================================
   MESSAGE
===================================== */

function showMessage(
  text,
  type
) {

  const message =
    document.getElementById(
      "message"
    );


  message.textContent =
    text;


  message.className =
    type;


  setTimeout(
    function() {

      message.className =
        "";

    },
    4000
  );

}


/* =====================================
   ESCAPE HTML
===================================== */

function escapeHTML(value) {

  return String(
    value || ""
  )

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

}


/* =====================================
   START APP
===================================== */

document.addEventListener(
  "DOMContentLoaded",
  loadRecords
);
