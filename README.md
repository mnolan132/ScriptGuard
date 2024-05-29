# SCRIPTGUARD

SCRIPTGUARD is a web extension designed to scan webpages and websites for cross-site scripting (XSS) and SQL injection vulnerabilities. It helps users determine if a site is safe for sharing personal information and assists developers in ensuring their sites are resilient to these types of attacks.

## Table of Contents

- [Description](#description)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Backend](#backend)
  - [Frontend](#frontend)
  - [Installing the Extension](#installing-the-extension)
- [Usage](#usage)
- [Contributing](#contributing)

## Description

SCRIPTGUARD scans webpages and websites for XSS and SQL injection vulnerabilities, helping users ensure site safety and aiding developers in securing their applications.

## Prerequisites

- Python 3
- Pip
- Node.js
- Node Package Manager (npm)

## Installation

### Backend

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/scriptguard.git

   ```

2. Navigate to the project directory:
   cd scriptguard

3. Navigate to the 'backend' folder:
   cd backend

4. Install the backend dependencies:
   pip install -r requirements.txt

5. Start the backend server:
   python main.py

### Frontend

6. Open a new terminal window and navigate to the 'frontend' folder:
   cd ../frontend

7. Install the frontend dependencies:
   npm install

8. Create a build file for the frontend:
   npm run build

### Installing the extension

9. In your Chrome browser, navigate to chrome://extensions.

10. At the top right corner of the page, toggle the 'Developer mode' switch on.

11. Click on the 'Load unpacked' button and select the 'frontend/dist' folder.

## Usage

Upon opening the extention for the first time, you will need to sign up and log in to be able to use the app.

If you are a developer and are using the app to test your site, tick the 'I am a developer' checkbox.

You can then open the extension any time you are browsing the web and run the 'scan' function to test the site you are browsing for vulnerabilities!

## Contributing

1. Fork the repository.

2. Create your feature branch (git checkout -b feature/AmazingFeature).

3. Commit your changes (git commit -m 'Add some AmazingFeature').

4. Push to the branch (git push origin feature/AmazingFeature).

5. Open a Pull Request.
