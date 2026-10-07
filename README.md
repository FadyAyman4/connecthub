# ConnectHub

ConnectHub is a responsive social media web application built with React. Users can create an account, browse a social feed, publish posts, interact with posts, follow other users, manage their profile, and discover random inspirational quotes.

The project combines data from the DummyJSON API with browser-based persistence for user-created content, making it easy to run locally without a separate backend.

## Features

- User registration and login
- Protected and public-only routes
- Home feed with posts and user profiles
- Create, edit, and delete posts
- Add images to posts
- Like posts with persisted like state
- View post details and comments
- Add and delete comments
- Search for users
- Follow and unfollow users
- Edit profile information and profile image
- Notifications view
- Random quote page
- Responsive layout for desktop and mobile screens
- Loading, empty, and error states throughout the application

## Tech Stack

- React 19
- React Router DOM 6
- Redux Toolkit and React Redux
- Axios
- Create React App
- DummyJSON API
- Browser `localStorage` for locally created data and session state

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Installation

Clone the repository and install its dependencies:

```bash
git clone <your-repository-url>
cd connecthub
npm install
```

### Run the application

Start the development server:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm start` | Runs the app in development mode. |
| `npm test` | Runs the test runner. |
| `npm run build` | Creates an optimized production build in `build/`. |
| `npm run eject` | Ejects the Create React App configuration. This is irreversible. |

## Application Routes

| Route | Access | Description |
| --- | --- | --- |
| `/home` | Authenticated | Browse the home feed and create posts. |
| `/profile/:id` | Authenticated | View a user's profile and posts. |
| `/posts/:id` | Public | View a post and its comments. |
| `/create-post` | Authenticated | Create a new post. |
| `/edit-post/:id` | Authenticated | Edit an existing post. |
| `/search` | Public | Search for users. |
| `/notifications` | Authenticated | View notifications. |
| `/quotes` | Authenticated | Get a random quote. |
| `/login` | Public | Sign in to ConnectHub. |
| `/register` | Public | Create a local ConnectHub account. |

## Data and Authentication

ConnectHub uses [DummyJSON](https://dummyjson.com) for sample users, posts, comments, authentication fallback, and quote data. Data created within the app is stored in the browser using `localStorage`.

The following local data is persisted in the browser:

- Registered users and session tokens
- User-created posts
- Comments on local posts
- Like state
- Follow relationships
- Local profile updates

Because this is a frontend project using browser storage, local accounts and created content are specific to the browser and device where they were created. Clear site storage to reset local application data.

## Project Structure

```text
src/
  components/   Reusable UI components
  hooks/        Custom React hooks
  pages/        Route-level page components
  services/     API and local-storage data services
  store/        Redux Toolkit slices and store configuration
  utils/        Shared utility functions
  App.js        Routing and application shell
  index.css     Global styles and responsive layout
```

## Production Build

Create a production build with:

```bash
npm run build
```

The generated files are placed in the `build/` directory and can be served by any static hosting provider.

## Future Improvements

- Replace browser storage with a dedicated backend and database
- Add stronger password handling and server-side authentication
- Add image upload storage
- Add real-time notifications
- Add automated component and integration test coverage

## License

This project is intended for educational and portfolio use.
