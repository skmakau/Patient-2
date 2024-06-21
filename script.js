
    function toggleLegend(legendId) {
        const legend = document.getElementById(legendId);
        if (legend.style.display === 'none' || legend.style.display === '') {
            legend.style.display = 'block';
        } else {
            legend.style.display = 'none';
        }
    }

    document.getElementById('surveyForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Validate the form manually to ensure all required fields are filled
        const form = document.getElementById('surveyForm');
        const requiredFields = form.querySelectorAll('input[required]');
        let allFieldsFilled = true;

        // Check each group of radio buttons
        const radioGroups = [...new Set([...form.querySelectorAll('input[type="radio"]')].map(radio => radio.name))];

        radioGroups.forEach(group => {
            const radioButtons = form.querySelectorAll(`input[name="${group}"]`);
            const isChecked = Array.from(radioButtons).some(radio => radio.checked);
            if (!isChecked) {
                allFieldsFilled = false;
                // Set focus on the first radio button of the group
                form.querySelector(`input[name="${group}"]`).focus();
            }
        });

        // Check other required fields
        requiredFields.forEach(field => {
            if (!field.value) {
                allFieldsFilled = false;
                field.focus();
            }
        });

        if (!allFieldsFilled) {
            alert('Please fill out all ratings before submitting.');
            return;
        }

        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        fetch('https://script.google.com/macros/s/AKfycbwomoDP-ACMAfEdpBlv0Oy3q8wWNFGTTXw3iO94jKeIQ8yzFMn-7SqVwT4ggm1CXq5M9Q/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            alert('Thank you for your ratings!');
            window.close();
        })
        .catch((error) => {
            console.error('Submission error:', error);
            alert('Thank you for your ratings!');
            window.close();
        });
    });

document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener("scroll", function() {
        const legend = document.getElementById("legend");
        const sections = document.querySelectorAll(".video-group");
        const submitButton = document.querySelector(".submit-btn");
        let found = false;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                found = true;
                const scaleType = section.getAttribute("data-scale");
                updateLegend(scaleType);
            }
        });

        const submitButtonRect = submitButton.getBoundingClientRect();
        if (submitButtonRect.top <= window.innerHeight && submitButtonRect.bottom >= 0) {
            found = false; // Hide legend if the submit button is in view
        }

        legend.style.display = found ? "block" : "none";
    });

    function updateLegend(scaleType) {
        const legend = document.getElementById("legend");
        const legendTitle = document.getElementById("legend-title");
        const scaleList = document.getElementById("scale-list");

        // Clear the current scale items
        while (scaleList.firstChild) {
            scaleList.removeChild(scaleList.firstChild);
        }

        // Add new scale items based on the scaleType
        if (scaleType === "tremor") {
            legendTitle.innerText = "Tremor Scale";
            scaleList.innerHTML = `
                <div class="scale-item">0 = Normal</div>
                <div class="scale-item">1 = Slight (amplitude <0.5 cm). May be intermittent.</div>
                <div class="scale-item">2 = Moderate amplitude (0.5-1 cm). May be intermittent.</div>
                <div class="scale-item">3 = Marked amplitude (1-2 cm).</div>
                <div class="scale-item">4 = Severe amplitude (>2 cm).</div>
            `;
        } else if (scaleType === "pouring") {
            legendTitle.innerText = "Pouring Scale";
            scaleList.innerHTML = `
                <div class="scale-item">0 = No tremor</div>
                <div class="scale-item">1 = Slight tremor, not affecting pouring</div>
                <div class="scale-item">2 = Moderate tremor, some difficulty pouring</div>
                <div class="scale-item">3 = Marked tremor, significant difficulty pouring</div>
                <div class="scale-item">4 = Severe tremor, unable to pour</div>
            `;
        } else if (scaleType === "drinking") {
            legendTitle.innerText = "Drinking Scale";
            scaleList.innerHTML = `
                <div class="scale-item">0 = No tremor</div>
                <div class="scale-item">1 = Slight tremor, not affecting drinking</div>
                <div class="scale-item">2 = Moderate tremor, some difficulty drinking</div>
                <div class="scale-item">3 = Marked tremor, significant difficulty drinking</div>
                <div class="scale-item">4 = Severe tremor, unable to drink</div>
            `;
        } else if (scaleType === "spiral") {
            legendTitle.innerText = "Spiral Scale";
            scaleList.innerHTML = `
                <div class="scale-item">0 = No tremor</div>
                <div class="scale-item">1 = Slight tremor, not affecting spiral drawing</div>
                <div class="scale-item">2 = Moderate tremor, some difficulty drawing spiral</div>
                <div class="scale-item">3 = Marked tremor, significant difficulty drawing spiral</div>
                <div class="scale-item">4 = Severe tremor, unable to draw spiral</div>
            `;
        }
    }
});
