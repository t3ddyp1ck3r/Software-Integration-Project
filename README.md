# Software Integration Project

## Description

This project integrates various software components using Node.js, Express, TypeScript, MongoDB, and PostgreSQL. It includes user authentication, session management, and CRUD operations with appropriate logging and error handling.

## Installation

1. **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2. **Install the dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

    Create a `.env.dev` file in the root directory with the following content:

    ```plaintext
    MONGO_URI="mongodb+srv://t3ddyp1ck3r:t3ddyp1ck3r@cluster0.ojzaipx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    POSTGRES_URI="postgresql://dev:password@localhost:5432/devbranchdb"
    JWT_SECRET_KEY="t3ddyp1ck3r"
    ```

## Running the Application

1. **Compile TypeScript files:**

    ```bash
    npm run build
    ```

2. **Start the development server:**

    ```bash
    npm run start:dev
    ```

3. **Running the production server:**

    ```bash
    npm run start
    ```

## Testing

1. **Run unit tests:**

    ```bash
    npm run test
    ```

## Linting and Formatting

1. **Lint the code:**

    ```bash
    npm run lint
    ```

2. **Fix linting issues:**

    ```bash
    npm run lint:fix
    ```

3. **Format the code:**

    ```bash
    npm run format
    ```

## Project Structure

- `src/` - Source files
    - `controllers/` - Controllers for handling requests
    - `middleware/` - Custom middleware
    - `models/` - Mongoose models
    - `routes/` - Express routes
    - `services/` - Services for business logic
- `dist/` - Compiled JavaScript files
- `.env.dev` - Environment variables for development

## Contributing
Please submit issues or pull requests for any bugs or improvements.

