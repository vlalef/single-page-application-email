document.addEventListener('DOMContentLoaded', function () {
    // Declare currentMailbox in the appropriate scope (outside the event handler)
    window.currentMailbox = 'inbox';

    // Use buttons to toggle between views
    document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
    document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
    document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
    document.querySelector('#compose').addEventListener('click', compose_email);

    // Add event listener for the compose form submission
    document.querySelector('#compose-form').addEventListener('submit', send_email);

    // By default, load the inbox
    load_mailbox('inbox');
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function compose_email() {
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#email-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';
    document.querySelector('#compose-recipients').value = '';
    document.querySelector('#compose-subject').value = '';
    document.querySelector('#compose-body').value = '';
}

function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        console.log('Toast container not found, creating one');
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '1000';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.style.padding = '10px 15px';
    toast.style.marginBottom = '10px';
    toast.style.borderRadius = '4px';
    toast.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    toast.style.minWidth = '200px';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';

    if (type === 'success') {
        toast.style.backgroundColor = '#4CAF50';
        toast.style.color = 'white';
    } else if (type === 'error') {
        toast.style.backgroundColor = '#F44336';
        toast.style.color = 'white';
    } else if (type === 'info') {
        toast.style.backgroundColor = '#2196F3';
        toast.style.color = 'white';
    }

    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            if (container.contains(toast)) {
                container.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

function send_email(event) {
    event.preventDefault();
    const csrftoken = getCookie('csrftoken');
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;

    fetch('/emails', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            recipients: recipients,
            subject: subject,
            body: body
        })
    })
    .then(response => response.json())
    .then(result => {
        if (result.error) {
            console.log(result.error);
            showToast(result.error, 'error');
        } else {
            showToast('Email sent successfully!', 'success');
            load_mailbox('sent');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Failed to send email', 'error');
    });
}

function load_mailbox(mailbox) {
    window.currentMailbox = mailbox;
    document.querySelector('#emails-view').style.display = 'block';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#email-view').style.display = 'none';
    document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

    fetch(`/emails/${mailbox}`)
        .then(response => response.json())
        .then(emails => {
            const emailsContainer = document.createElement('div');

            if (emails.length === 0) {
                const emptyMessage = document.createElement('p');
                emptyMessage.innerHTML = 'No emails in this mailbox.';
                emailsContainer.appendChild(emptyMessage);
            }

            emails.forEach(email => {
                const emailDiv = document.createElement('div');
                emailDiv.className = 'email-row';
                emailDiv.style.padding = '10px';
                emailDiv.style.margin = '5px 0';
                emailDiv.style.border = '1px solid #ccc';
                emailDiv.style.borderRadius = '4px';
                emailDiv.style.display = 'flex';
                emailDiv.style.justifyContent = 'space-between';
                emailDiv.style.cursor = 'pointer';
                emailDiv.style.backgroundColor = email.read ? '#e9e9e9' : 'white';
                emailDiv.innerHTML = `
                    <div><strong>${email.sender}</strong></div>
                    <div class="subject">${email.subject}</div>
                    <div class="timestamp">${email.timestamp}</div>
                `;

                emailDiv.addEventListener('click', () => {
                    view_email(email.id);
                });

                emailsContainer.appendChild(emailDiv);
            });

            document.querySelector('#emails-view').appendChild(emailsContainer);
        })
        .catch(error => {
            console.error('Error loading mailbox:', error);
            showToast('Failed to load emails', 'error');
        });
}

function view_email(email_id) {
    const csrftoken = getCookie('csrftoken');
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#email-view').style.display = 'block';
    document.querySelector('#email-view').innerHTML = '';

    fetch(`/emails/${email_id}`)
        .then(response => response.json())
        .then(email => {
            if (!email.read) {
                fetch(`/emails/${email_id}`, {
                    method: 'PUT',
                    headers: {
                        'X-CSRFToken': csrftoken,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        read: true
                    })
                })
                .catch(error => {
                    console.error('Error marking email as read:', error);
                });
            }

            const emailDetails = document.createElement('div');
            emailDetails.innerHTML = `
            <div style="margin-bottom: 20px;">
                <p><strong>From:</strong> ${email.sender}</p>
                <p><strong>To:</strong> ${email.recipients.join(', ')}</p>
                <p><strong>Subject:</strong> ${email.subject}</p>
                <p><strong>Timestamp:</strong> ${email.timestamp}</p>
            </div>
            <hr>
            <div style="margin: 20px 0; white-space: pre-wrap;">${email.body}</div>`;

            document.querySelector('#email-view').appendChild(emailDetails);

            const actionsDiv = document.createElement('div');
            actionsDiv.style.marginTop = '20px';

            const replyButton = document.createElement('button');
            replyButton.className = 'btn btn-primary';
            replyButton.innerHTML = 'Reply';
            replyButton.addEventListener('click', () => reply_to_email(email));
            actionsDiv.appendChild(replyButton);

            const currentUser = document.querySelector('h2').innerHTML;
            if (email.sender !== currentUser || email.recipients.includes(currentUser)) {
                const archiveButton = document.createElement('button');
                archiveButton.className = 'btn btn-secondary';
                archiveButton.innerHTML = email.archived ? 'Unarchive' : 'Archive';
                archiveButton.style.marginLeft = '10px';

                archiveButton.addEventListener('click', () => {
                    fetch(`/emails/${email_id}`, {
                        method: 'PUT',
                        headers: {
                            'X-CSRFToken': csrftoken,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            archived: !email.archived
                        })
                    })
                    .then(() => {
                        const message = email.archived ? 'Email unarchived successfully!' : 'Email archived successfully!';
                        showToast(message, 'success');
                        load_mailbox('inbox');
                    })
                    .catch(error => {
                        console.error('Error updating archive status:', error);
                        showToast('Failed to update archive status', 'error');
                    });
                });

                actionsDiv.appendChild(archiveButton);
            }

            const backButton = document.createElement('button');
            backButton.className = 'btn btn-outline-dark';
            backButton.innerHTML = 'Back';
            backButton.style.marginLeft = '10px';
            backButton.addEventListener('click', () => {
                load_mailbox(window.currentMailbox);
            });
            actionsDiv.appendChild(backButton);

            document.querySelector('#email-view').appendChild(actionsDiv);
        })
        .catch(error => {
            console.error('Error loading email:', error);
            showToast('Failed to load email', 'error');
        });
}

function reply_to_email(email) {
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#email-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';
    document.querySelector('#compose-recipients').value = email.sender;

    let subject = email.subject;
    if (!subject.startsWith('Re:')) {
        subject = `Re: ${subject}`;
    }
    document.querySelector('#compose-subject').value = subject;
    document.querySelector('#compose-body').value =
        `On ${email.timestamp} ${email.sender} wrote:\n${email.body}\n\n`;
}