document.addEventListener("DOMContentLoaded", function () {
    window.bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    window.editingIndex = null;

    function renderBookings() {
        const tableBody = document.querySelector("#bookings-table tbody");
        tableBody.innerHTML = "";

        bookings.forEach((booking, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${booking.dates.join(", ")}</td>
                <td>${booking.startTime}</td>
                <td>${booking.endTime}</td>
                <td>${booking.name}</td>
                <td>${booking.game}</td>
                <td>${booking.tables}</td>
                <td>
                    <button class="edit-btn" onclick="editBooking(${index})">Edit</button>
                    <button class="delete-btn" onclick="deleteBooking(${index})">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    function initializeDatepicker() {
        flatpickr("#frontpage-dates", {
            mode: "multiple",
            dateFormat: "Y-m-d",
            defaultDate: []
        });
    }

    function populateTimeDropdowns(startHour = 15) {
        const startDropdown = document.getElementById("frontpage-start-time");
        const endDropdown = document.getElementById("frontpage-end-time");
        startDropdown.innerHTML = "";
        endDropdown.innerHTML = "";
        
        for (let hour = startHour; hour <= 23; hour++) {
            const formattedHour = hour < 10 ? `0${hour}:00` : `${hour}:00`;
            startDropdown.innerHTML += `<option value="${formattedHour}">${formattedHour}</option>`;
            endDropdown.innerHTML += `<option value="${formattedHour}">${formattedHour}</option>`;
        }
    }

    document.getElementById("tournament-mode").addEventListener("change", function() {
        if (this.checked) {
            populateTimeDropdowns(10);
        } else {
            populateTimeDropdowns(15);
        }
    });

    window.editBooking = function (index) {
        const booking = bookings[index];
        document.getElementById("frontpage-dates").value = booking.dates.join(", ");
        document.getElementById("frontpage-start-time").value = booking.startTime;
        document.getElementById("frontpage-end-time").value = booking.endTime;
        document.getElementById("frontpage-name").value = booking.name;
        document.getElementById("frontpage-game").value = booking.game;
        document.getElementById("frontpage-tables").value = booking.tables;
        document.getElementById("tournament-mode").checked = booking.tables === 10;
        editingIndex = index;
        document.getElementById("submit-button").textContent = "Update Booking";
    };

    window.deleteBooking = function (index) {
        if (confirm("Are you sure you want to delete this booking?")) {
            bookings.splice(index, 1);
            localStorage.setItem("bookings", JSON.stringify(bookings));
            renderBookings();
        }
    };

    document.getElementById("frontpage-booking-form").addEventListener("submit", function (event) {
        event.preventDefault();
        const dates = document.getElementById("frontpage-dates").value.split(", ").map(d => d.trim());
        const startTime = document.getElementById("frontpage-start-time").value;
        const endTime = document.getElementById("frontpage-end-time").value;
        const name = document.getElementById("frontpage-name").value;
        const game = document.getElementById("frontpage-game").value;
        const tournamentMode = document.getElementById("tournament-mode").checked;
        const tables = tournamentMode ? 10 : parseInt(document.getElementById("frontpage-tables").value);
        
        if (!dates.length || !startTime || !endTime || !name || !game || isNaN(tables)) {
            alert("Please fill all fields correctly.");
            return;
        }

        if (endTime <= startTime) {
            alert("End time must be later than start time.");
            return;
        }

        const newBooking = { dates, startTime, endTime, name, game, tables };

        if (editingIndex !== null) {
            bookings[editingIndex] = newBooking;
            editingIndex = null;
            document.getElementById("submit-button").textContent = "Add Booking";
        } else {
            bookings.push(newBooking);
        }

        localStorage.setItem("bookings", JSON.stringify(bookings));
        renderBookings();
        document.getElementById("frontpage-booking-form").reset();
        document.getElementById("tournament-mode").checked = false;
        initializeDatepicker();
        populateTimeDropdowns();
    });

    initializeDatepicker();
    populateTimeDropdowns();
    renderBookings();
});

