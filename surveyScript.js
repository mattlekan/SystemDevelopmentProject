// Form submission, creates formData object and uses fetch to send post request to server with data
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('tbSurveyForm').addEventListener('submit', function(event) {
        event.preventDefault(); // To prevent default form submission

        alert("Thank you for submitting the questionnaire")

            //deselect text fields after submission
        var textFields = document.querySelectorAll("input[type='text']");
            textFields.forEach(function(textField) {
            textField.value = "";
        });

            //deselect number field after submission
        var numFields = document.querySelectorAll("input[type='number']");
            numFields.forEach(function(numFields) {
                numFields.value = "";
            });

            //deselect radio buttons after submission
        var radioButtons = document.querySelectorAll("input[type='radio']");
            radioButtons.forEach(function(radioButton) {
            radioButton.checked = false;
        });

            //deselect checkboxes after submission
        var checkboxes = document.querySelectorAll("input[type='checkbox']");
            checkboxes.forEach(function(checkbox) {
            checkbox.checked = false;
        });

        // Retrieve form data
        var fullName = document.getElementById('stuName').value;
        var studentId = document.getElementById('studentId').value;
        // Retrieve other question responses as well, just trying to work with the first couple questions to get it to work

        // Create form data object
        var formData = new FormData();
        formData.append('stuName', fullName);
        formData.append('studentId', studentId);
        // Append other form data as well, just using this data now until it works 

        // Submit the form data to the server using fetch
        fetch('/submitSurvey', {
            method: 'POST',
            body: formData
        })
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(function(data) {
            // Handle success response from the server
            console.log('Survey submitted successfully:', data);
            // Here we could redirect students to a success page if successfully submitted
        })
        .catch(function(error) {
            // Handle error
            console.error('Error submitting survey:', error);
            // Here we could also redirect students to a failed submission if there was an error
        });
    });
});

