document.getElementById('openWidget').addEventListener('click', () => {
    document.getElementById('widget').classList.add('open');  // This will make the widget visible
});

// You can also add functionality to close the widget
document.getElementById('closeWidget').addEventListener('click', () => {
    document.getElementById('widget').classList.remove('open');  // This will hide the widget
});
// widget.js - Client-Side JavaScript

document.getElementById('sendQuestion').addEventListener('click', async () => {
    const question = document.getElementById('userInput').value.trim();
    if (question === '') return;

    const chatContainer = document.getElementById('chatContainer');

    // Show the user message with a person icon
    chatContainer.innerHTML += `
        <div class="user-message">
            <img src="https://img.icons8.com/ios/50/000000/user-male.png" alt="person" class="message-icon">
            <div class="message-text">${question}</div>
        </div>
    `;

    // Clear the input box after sending the message
    document.getElementById('userInput').value = '';

    // Get the token from localStorage (ensure the user is logged in)
    const token = localStorage.getItem('authToken');
    if (!token) {
        console.error('No token found. Please log in first.');
        return;
    }

    // Send the request to the backend to process the question
    try {
        const response = await fetch('http://localhost:3000/api/ai/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`  // Pass the JWT token for authentication
            },
            body: JSON.stringify({ question })
        });

        const data = await response.json();

        if (data.response) {
            // Show the AI response with a robot icon
            chatContainer.innerHTML += `
                <div class="robot-message">
                    <img src="https://img.icons8.com/ios/50/000000/robot.png" alt="robot" class="message-icon">
                    <div class="message-text">${data.response}</div>
                </div>
            `;
        } else {
            // Handle case when no response is received
            chatContainer.innerHTML += `
                <div class="robot-message">
                    <img src="https://img.icons8.com/ios/50/000000/robot.png" alt="robot" class="message-icon">
                    <div class="message-text">Sorry, I couldn't answer your question.</div>
                </div>
            `;
        }

        // Scroll to the bottom to see the latest message
        chatContainer.scrollTop = chatContainer.scrollHeight;
    } catch (error) {
        console.error('Error during API request:', error);
        chatContainer.innerHTML += `
            <div class="robot-message">
                <img src="https://img.icons8.com/ios/50/000000/robot.png" alt="robot" class="message-icon">
                <div class="message-text">Sorry, there was an error processing your request. Please try again.</div>
            </div>
        `;
    }
});
