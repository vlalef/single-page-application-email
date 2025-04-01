# Mail - Single Page Email Client

A single-page email client application built with Django and JavaScript. This project allows users to send and receive emails within a self-contained system, where all emails are stored in a database rather than being sent to actual email servers.

## Features

- **User Authentication:** Register, login, and logout functionality
- **Email Composition:** Send emails to registered users
- **Mailbox Views:** Browse inbox, sent, and archived emails
- **Email Management:** Read, reply to, and archive/unarchive emails
- **Single-Page Application:** Dynamic content loading without page refreshes
- **Toast Notifications:** Visual feedback for user actions

## Technology Stack

- **Backend:** Django
- **Frontend:** JavaScript, HTML, CSS, Bootstrap
- **Database:** SQLite (default in Django)

## Prerequisites

- Python 3.x
- Django

## Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd mail

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
   
3. **Install django:**
   ```bash
    pip install django
    ```

4. **Install PostgreSQL:** Follow the instructions on the [PostgreSQL installation page](https://www.postgresql.org/download/).
   ```bash
   # Create a database and user:
   sudo -u postgres psql
   CREATE DATABASE mail;
   CREATE USER mailuser WITH PASSWORD 'password';
   ALTER ROLE mailuser SET client_encoding TO 'utf8';
   ALTER ROLE mailuser SET default_transaction_isolation TO 'read committed';
   ALTER ROLE mailuser SET timezone TO 'UTC';
   GRANT ALL PRIVILEGES ON DATABASE mail TO mailuser;
   \q
   ```

5. **Apply migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Run the development server:**
   ```bash
    python manage.py runserver
    ```
   
7. **Access the application:**
Open your browser and navigate to http://127.0.0.1:8000 to view the application.
8. **Register for an account:**
   - Click on the "Register" link to create a new user account.
   - Fill in the required fields and submit the form.

## Application Structure
### Models
- **User Model:** Extends Django's AbstractUser for email-based authentication
- **Email Model:** Stores emails with sender, recipients, subject, body, timestamp, read and archived status

### Views
- **Authentication:**
  - RegisterView: Handles user registration
  - LoginView: Handles user login
  - LogoutView: Handles user logout

- **Email Management:**

- **InboxView**: Displays received emails
  - **SentView**: Displays sent emails
  - **ComposeView**: Handles email composition and sending
  - **EmailDetailView**: Displays email details and allows replying
  - **ArchiveView**: Displays archived emails

- **Mailbox Views:**
  - **InboxView**: Displays received emails

### Frontend
- **Single-Page Architecture:** Uses JavaScript to dynamically load content without full page refreshes
- **Mailbox Interface:** Displays emails in a user-friendly format with read and unread indicators
- **Toast Notifications:** Provides feedback for user actions (e.g., email sent, archived)
- **Compose Form:** Interface for creating and sending new emails

## Usage
1. **Register for an account:** Click on the "Register" link to create a new user account.
   - Create a new account or log in with existing credentials
   - An email format is acceptable as this is a closed system
2. **Navitate the mailbox:** 
   - Click on the "Inbox" link to view received emails
   - Click on the "Sent" link to view sent emails
   - Click on the "Compose" link to create a new email
   - Click on the "Archive" link to view archived emails

3. **Compose Emails:**
   - Click on the "Compose" link to create a new email
   - Fill in the recipient, subject, and body fields
   - Click "Send" to send the email
4. **Read Emails:**
   - Click on an email in the inbox to view its details
   - Click "Reply" to respond to the email
   - Click "Archive" to move the email to the archived folder

## Project Files
- **models.py:** Contains the database models for the application
- **views.py:** Contains the views for handling requests and rendering templates
- **urls.py:** Contains the URL routing for the application
- **inbox.html:** Template for displaying the inbox
- **Templates:** Contains HTML templates for the application
- **css:** Contains CSS files for styling the application

## Note
This application simulates an email client where all messages are stored locally in the database. No actual emails are sent to external servers, making it a safe environment for testing and learning web development concepts.
