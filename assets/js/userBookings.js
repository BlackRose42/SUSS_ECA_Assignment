$(document).ready(function () {
    $(document).on("click", ".delete-btn", function (e) {
        e.preventDefault(); 

        const row = $(this).closest("tr"); 
        const hotelName = $(this).data("hotel-name");
        const checkInDate = $(this).data("check-in-date");
        const status = $(this).data("status");

        if (confirm("Do you want to proceed with deleting this booking?")) {
            $.ajax({
                url: "/deleteBooking",
                type: "POST",
                data: {
                    hotel_name: hotelName,
                    old_check_in_date: checkInDate,
                    status: status,
                },
                success: function (response) {
                    row.remove();
                    alert("Booking deleted successfully!");
                },
                error: function (xhr, status, error) {
                    alert("Error deleting booking: " + error);
                },
            });
        }
    });
});

function formatDate(dateString) {
    const dateParts = dateString.split("-"); 
    if (dateParts.length === 3) {
        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2];
        return `${day}/${month}/${year}`; 
    }
    return dateString; 
}

$(document).on("click", ".update-btn", function (e) {
    e.preventDefault();
    const row = $(this).closest("tr");
    const hotelName = $(this).data("hotel-name");
    const oldCheckInDate = $(this).data("old-check-in-date");
    const newCheckInDate = row.find("#check_in_date").val();
    const status = $(this).data("status");

    const formattedDate = formatDate(newCheckInDate);

    const newCheckInDateTime = new Date(newCheckInDate); 
    const currentDateTime = new Date();

    $.ajax({
        url: "/updateBooking",
        type: "POST",
        data: {
            hotel_name: hotelName,
            old_check_in_date: oldCheckInDate,
            check_in_date: newCheckInDate,
            status: status,
        },
        success: function (response) {
            alert("Booking updated successfully!");

            row.find("td:eq(3)").text(formattedDate); 

            if (newCheckInDateTime <= currentDateTime) {
                newStatus = "Completed"; 
                row.find("td:eq(4)").text("")
            }

            row.find("td:eq(2)").text(newStatus); 
            if (newStatus === "Completed") {
                const deleteButton = `
          <button
            type="button"
            class="btn btn-primary delete-btn"
            data-hotel-name="${hotelName}"
            data-check-in-date="${newCheckInDate}"
            data-status="completed"
          >
            Delete
          </button>
        `;
                row.find(".update-btn, .cancel-btn").remove();
                row.find("td:last-child").html(deleteButton);
            }
        },
        error: function (xhr, status, error) {
            alert("Error updating booking: " + error);
        },
    });
});


$(document).on("click", ".cancel-btn", function (e) {
    e.preventDefault();
    const row = $(this).closest("tr");
    const hotelName = $(this).data("hotel-name");
    const checkInDate = $(this).data("check-in-date");
    const status = $(this).data("status");

    if (confirm("Are you sure you want to cancel this booking?")) {
        $.ajax({
            url: "/cancelBooking",
            type: "POST",
            data: { hotel_name: hotelName, old_check_in_date: checkInDate, status: status },
            success: function (response) {
                alert("Booking cancelled successfully!");
                row.find("td:eq(2)").text("Cancelled"); 
                row.find("td:eq(4)").html(""); 
                const deleteButton = `
          <button
            type="button"
            class="btn btn-primary delete-btn"
            data-hotel-name="${hotelName}"
            data-check-in-date="${checkInDate}"
            data-status="cancelled"
          >
            Delete
          </button>
        `;
                row.find(".update-btn, .cancel-btn").remove();
                row.find("td:last-child").html(deleteButton);
            },
            error: function (xhr, status, error) {
                alert("Error cancelling booking: " + error);
            },
        });
    }
});

