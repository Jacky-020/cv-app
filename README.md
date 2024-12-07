# Getting Started with this App

This README explain the function in this application.

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (which includes npm)
- [Visual Studio Code](https://code.visualstudio.com/)
- MetaMask extension on browser

## Steps to Open the App

### Direct access to netlify ###
https://jacky-020-cv-app.netlify.app/

### Deploy locally (may fails because of environmental issue) ###
1. **Download the Project**
   - Download the project folder and extract it to your desired location.

2. **Open the Project in VS Code**
   - Launch Visual Studio Code.
   - Open the downloaded project folder.

3. **Navigate to the Project Directory**
   - In the terminal, change directory to the folder /cv_app:
     ```bash
     cd ./[file_path]/cv_app
     ```

4. **Install Dependencies**
   - Run the following command to install all necessary dependencies:
     ```bash
     npm install
     ```

5. **Start the Application**
   - After the installation is complete, start the application with:
     ```bash
     npm start
     ```
   - This will launch the app in your default web browser.

6. **View the App**
   - Open your browser and go to [http://localhost:3000](http://localhost:3000) to view the application.

### Troubleshooting

- If you encounter any issues, ensure that all dependencies are installed correctly and that your Node.js version is compatible with the project.
- `node -v` to check nodejs version, the version I uses is `20.15.1`


# General View

This is a CV validation app that provides additional validation features for job-seeking applications like LinkedIn.

### General Features:

- As an *employee*, you can send work experience proposals to an *employer* and wait for approval.
- As an *employer*, you can approve received proposals.
- Upon approving a proposal, the *employer* gains reputation points as a sign of being more trustworthy.
- As an *employer*, you can comment on other *employers* when necessary (peer comments).
- For all users, you can view *employees'* work experience records. The decentralized and transparent properties of blockchain ensure confidentiality.
- For all users, you can view peer comments about *employers*. This ensures that *employers* are responsible when approving work experience records; otherwise, they may be condemned by other *employers*.

This app must be used with the MetaMask plugin. When using the app, please switch to the corresponding MetaMask account. All actions will be sent using this MetaMask account, and there are no other login functions available.

### Pages:

- **Registration (Starting Page)**: For registering a MetaMask account as one of the two types: *employee* or *employer*.
- **Show Records**: Displays submitted/received work experience records for the current account.
- **Propose Work Experience**: Allows *employee* accounts to send proposed work experience records to *employers*.
- **Search Employers**: Displays a list of employer accounts. Users can click on a particular employer to see their peer comments. If the user is an *employer*, they can proceed to comment if they have enough reputation points.
- **Search Employees**: For checking the work experience records of other *employees*.

# Detail workflow

### preparation

1. login Metamask account
![](markdown_images\login_metamask.png)
2. connect Metamask account to the app
![](markdown_images\connect_metamask.png)
- The app only works when you have switched to a connected Metamask account

### registration

1. click on the 'REGISTRATION' on the top navbar to switch to registation page
2. Enter the account name 
3. click on the left tab *REGISTER AS EMPLOYEE*
![](markdown_images\registration.png)