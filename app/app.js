$(document).ready(function () {
  const apiUrl = "http://localhost:2001/api/items";

  // Fetch tasks on page load
  fetchTasks();

  // Form submission
  $("#todoForm").submit(function (e) {
    e.preventDefault();
    const taskText = $("#taskInput").val();

    if (taskText.trim() !== "") {
      addTask(taskText);
    } else {
      alert("Task cannot be empty!");
    }
  });

  // Function to fetch tasks from the server
  function fetchTasks() {
    $.get(apiUrl)
      .done(function (response) {
        console.log("Server Response:", response);
        const tasks = response || [];
        displayTasks(tasks);
      })
      .fail(function (xhr, status, error) {
        console.error("Error fetching tasks:", error);
      });
  }

  // Function to display tasks on the page
  function displayTasks(response) {
    const tasks = response && response.data ? response.data : [];
    const taskList = $("#taskList");
    taskList.empty();

    tasks.forEach(function (task) {
      const listItem = $("<li>")
        .text(task.task)
        .click(function () {
          toggleTaskCompletion(task._id, !task.completed);
        });

      if (task.completed) {
        listItem.addClass("completedTask");
      }

      // Create a div to hold both buttons
      const buttonContainer = $("<div>").addClass("buttonContainer");

      // Add Update button with different color
      const updateButton = $("<button>")
        .text("Update")
        .addClass("updateButton")
        .click(function () {
          updateTaskPrompt(task._id, task.task);
        });

      // Add Delete button with different color
      const deleteButton = $("<button>")
        .text("Delete")
        .addClass("deleteButton")
        .click(function () {
          deleteTask(task._id);
        });

      // Append buttons to the div
      buttonContainer.append(updateButton, deleteButton);

      // Append the div to the list item
      listItem.append(buttonContainer);
      taskList.append(listItem);
    });
  }

  // Function to add a new task
  function addTask(text) {
    $.ajax({
      url: apiUrl,
      type: "POST",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({ task: text, completed: false }), // Assuming your server expects a 'task' property
      success: function () {
        fetchTasks();
        $("#taskInput").val("");
      },
      error: function (xhr, status, error) {
        console.error("Error adding task:", error);
      },
    });
  }

  // Function to delete a task
  function deleteTask(id) {
    $.ajax({
      url: `${apiUrl}/${id}`,
      type: "DELETE",
      success: function () {
        fetchTasks();
      },
      error: function () {
        alert("Error deleting task");
      },
    });
  }

  // Function to toggle task completion
  function toggleTaskCompletion(id, completed) {
    $.ajax({
      url: `${apiUrl}/${id}`,
      type: "PUT",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({ completed: completed }),
      success: function () {
        fetchTasks();
      },
      error: function () {
        alert("Error updating task completion");
      },
    });
  }

  // Function to prompt the user for an updated task
  function updateTaskPrompt(id, currentTask) {
    const updatedTask = prompt("Update task:", currentTask);
    if (updatedTask !== null) {
      updateTask(id, updatedTask);
    }
  }

  // Function to update a task
  function updateTask(id, updatedTask) {
    $.ajax({
      url: `${apiUrl}/${id}`,
      type: "PUT",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify({ task: updatedTask }),
      success: function () {
        fetchTasks();
      },
      error: function () {
        alert("Error updating task");
      },
    });
  }
});
