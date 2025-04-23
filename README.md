## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

1.  **Install Node.js:**
    Make sure you have the latest version of Node.js installed. You can download it from [https://nodejs.org/](https://nodejs.org/).

2.  **Install pnpm:**
    This project uses `pnpm` for package management. Install it globally using npm:
    ```bash
    npm install -g pnpm@latest-10
    ```

3. **Add Supabase Environment Variables:**
    Make sure too create the file `.env.local` on the root folder with the following schema:
    ```
    NEXT_PUBLIC_SUPABASE_URL=https://ecsmuazasbpbbjunahyu.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjc211YXphc2JwYmJqdW5haHl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ0MTA5OTYsImV4cCI6MjA1OTk4Njk5Nn0.DPus8hBW58AHpZeJcxflrE22__xWtC290oMqOi8mTSk
    ENCRYPTION_KEY=fb970c77368ff3aac73ed1639f755ff200ad9db847ff78b00a054bbd6f2802bb
    ```

### Setup

1.  **Install Dependencies:**
    Navigate to the project directory in your terminal and install the necessary dependencies:
    ```bash
    pnpm install
    ```

### Running the Development Server

1.  **Start the Server:**
    Run the following command to start the development server:
    ```bash
    pnpm dev
    ```

2.  **Open in Browser:**
    Open [http://localhost:3000](http://localhost:3000) in your web browser to see the application.

