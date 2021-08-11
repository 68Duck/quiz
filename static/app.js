function submitPressed(){
  var emailInput = document.getElementById("emailInput")
  var email = emailInput.innerHTML
  var passwordInput = document.getElementById("passwordInput")
  var password = passwordInput.innerHTML
  var messageArea = document.getElementById("messageArea")
  var message = messageArea.value
  emailInformation = {
    "email":email,
    "password":password,
    "message":message
  }
  sendEmailRequest(emailInformation)
}

const sendEmailRequest = async (emailInformation) => {
  const url = '/sendEmail'; // the URL to send the HTTP request to
  const body = JSON.stringify(emailInformation); // whatever you want to send in the body of the HTTP request
  const headers = {'Content-Type': 'application/json'}; // if you're sending JSON to the server
  const method = 'POST';
  const response = await fetch(url, { method, body, headers });
  const data = await response.text(); // or response.json() if your server returns JSON
}
