# Loan Tracker

A simple and beautiful application to track your loans and payments. Add loans, record payments, and visualize your progress towards becoming debt-free.

## ✨ Features

- **Add & Manage Loans:** Easily add new loans with details like principal, interest rate, lender, and borrower.
- **Track Payments:** Record payments and loan redraws for each loan.
- **Interactive Dashboard:** View all your loans at a glance with progress bars and key stats.
- **Detailed Loan View:** Dive into a specific loan to see a full summary, payment history, and a visual repayment chart.
- **Borrower Profiles:** Group loans by borrower and view a summary of their total debt.
- **Global Analytics:** Get a high-level overview of your entire loan portfolio with aggregate statistics.
- **CSV Import/Export:** Easily back up a loan's data or import it into a new instance.
- **Responsive Design:** A clean, modern UI that works beautifully on desktop and mobile devices.

## 🚀 Getting Started on Ubuntu

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your system to run the application.

It is recommended to install Node.js using [Node Version Manager (nvm)](https://github.com/nvm-sh/nvm) to avoid potential permission issues.

1.  **Install `nvm`:**
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    ```
    *You may need to close and reopen your terminal after installation for the changes to take effect.*

2.  **Install the latest LTS (Long-Term Support) version of Node.js:**
    ```bash
    nvm install --lts
    nvm use --lts
    ```

3.  **Verify the installation:**
    ```bash
    node -v
    # Should print a version number, e.g., v20.11.1
    npm -v
    # Should print a version number, e.g., 10.2.4
    ```

### Installation

1.  **Clone the repository:**
    Open your terminal and clone the project files to your local machine.
    ```bash
    # Replace <repository-url> with the actual URL of your Git repository
    git clone <repository-url>
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd <repository-directory-name>
    ```

### Running the Application

This is a static web application that does not require a complex build step. You just need a simple local server to serve the `index.html` file. The easiest way to do this is with the `serve` package.

1.  **Start the local server:**
    In your terminal, from the root directory of the project, run the following command:
    ```bash
    npx serve
    ```
    *`npx` is a package runner tool that comes with `npm`. This command will automatically download the `serve` package if you don't have it and run it in the current directory.*

2.  **View the app in your browser:**
    The command will output a local URL. Open your web browser and navigate to it. It will typically be:
    [http://localhost:3000](http://localhost:3000)

The application should now be running in your browser!

## 🛠️ Tech Stack

- **[React](https://reactjs.org/):** A JavaScript library for building user interfaces.
- **[Tailwind CSS](https://tailwindcss.com/):** A utility-first CSS framework (used via CDN).
- **No Build Step:** The application uses modern browser features like ES Modules and `importmaps` to run directly without a build process (like Vite or Webpack).
