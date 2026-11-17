
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/* =================================
   SUPABASE CONNECTION
================================= */

const supabaseUrl = "https://jwikxuykjqrhrlrsemsi.supabase.co";

const supabaseKey = "sb_publishable_8EhvJZxmcCAD2zQHCSKRDA_TVGAmuFx";

const supabase = createClient(supabaseUrl, supabaseKey);


/* =================================
   CONFETTI CELEBRATION
================================= */

function celebrate() {

    confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: [
            "#ff7b00",
            "#ffb347",
            "#c65d20",
            "#fff1df",
            "#9a3412"
        ]
    });

}


/* =================================
   INVITATION OPENING
================================= */

const invitationButton = document.getElementById("openInvitation");

const invitationSection = document.getElementById("invitation");

invitationButton.addEventListener("click", function () {

    // Unlock scrolling
    document.body.classList.add("invitation-open");

    // Reveal invitation
    invitationSection.style.display = "block";

    // Celebrate
    celebrate();

    // Scroll to invitation
    invitationSection.scrollIntoView({
        behavior: "smooth"
    });

    // Update button
    invitationButton.textContent = "Invitation Opened!";

    invitationButton.disabled = true;

});


/* =================================
   RSVP FORM
================================= */

const rsvpForm = document.getElementById("rsvpForm");

const rsvpMessage = document.getElementById("rsvpMessage");

rsvpForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    // Get guest information
    const guestName = document.getElementById("guestName").value.trim();

    const attendance = document.getElementById("attendance").value;

    // Get selected events
    const selectedEvents = document.querySelectorAll(
        'input[name="event"]:checked'
    );

    const eventNames = Array.from(selectedEvents).map(function (option) {
        return option.value;
    });

    // Validate form
    if (!guestName) {
        rsvpMessage.textContent = "Please enter your name.";
        return;
    }

    if (attendance !== "Yes" && attendance !== "No") {
        rsvpMessage.textContent = "Please select your attendance response.";
        return;
    }

    if (eventNames.length === 0) {
        rsvpMessage.textContent = "Please select at least one event.";
        return;
    }

    // Prevent multiple submissions
    const submitButton = rsvpForm.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    rsvpMessage.textContent = "Saving your RSVP...";

    try {

        // Save RSVP to Supabase
        const { error } = await supabase
            .from("rsvps")
            .insert({
                guest_name: guestName,
                attending: attendance === "Yes",
                events: eventNames.join(", ")
            });

        if (error) {
            throw error;
        }

        // Successful submission
        if (attendance === "Yes") {

            rsvpMessage.textContent =
                `Thank you, ${guestName}! Your RSVP has been received. Can't wait to celebrate with you!`;

        } else {

            rsvpMessage.textContent =
                `Thank you for letting me know, ${guestName}. You'll be missed!`;

        }

        // Celebrate successful RSVP
        celebrate();

        // Clear form
        rsvpForm.reset();

    } catch (error) {

        console.error("RSVP submission error:", error);

        rsvpMessage.textContent =
            "Sorry, we couldn't save your RSVP. Please try again.";

    } finally {

        submitButton.disabled = false;
        submitButton.textContent = "Send My RSVP";

    }

});
