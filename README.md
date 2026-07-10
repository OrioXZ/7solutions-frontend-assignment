# 7Solutions Frontend Assignment

Frontend assignment implementing the required **Auto Delete Todo List** and the optional **Department Summary** challenge.

## Links

- Live Demo: https://7solutions-frontend-assignment-phi.vercel.app
- Source Code: https://github.com/OrioXZ/7solutions-frontend-assignment
- Original Assignment: https://github.com/7-solutions/frontend-assignment

## Features

### Core Assignment: Auto Delete Todo List

The main list contains fruit and vegetable items.

- Clicking an item moves it to its matching `Fruit` or `Vegetable` column.
- Each moved item has an independent 5-second timer.
- After 5 seconds, the item returns to the bottom of the main list.
- Clicking an item in a category column returns it immediately.
- Manual return clears the active timer.
- Active timers are cleaned up when the component unmounts.
- The original assignment item order is preserved.

Route:

```text
/auto-delete-todo
```

### Optional Assignment: Department Summary

User data is fetched from DummyJSON through an internal Next.js API route and transformed into department-based summaries.

Each department contains:

- Male count
- Female count
- Age range
- Hair color counts
- User name to postal code mapping

The transformation processes the user collection in a single pass with `O(n)` time complexity.

The UI includes:

- Alphabetically sorted department rows
- Calculated department totals
- Loading and error states
- Retry support
- Expandable hair color and address details
- Responsive horizontal table scrolling

Routes:

```text
/department-summary
/api/department-summary
```

## Technology

- Next.js
- React
- TypeScript
- Tailwind CSS
- Vitest
- React Testing Library
- jsdom

## Project Structure

```text
src/
├── app/
│   ├── api/
│   │   └── department-summary/
│   │       └── route.ts
│   ├── auto-delete-todo/
│   │   └── page.tsx
│   ├── department-summary/
│   │   └── page.tsx
│   └── page.tsx
├── components/
│   ├── auto-delete-todo.tsx
│   └── department-summary-view.tsx
├── data/
│   └── todo-items.ts
├── lib/
│   └── group-users-by-department.ts
├── services/
│   └── dummyjson-users.ts
└── types/
    ├── dummy-user.ts
    └── todo.ts
```

## Getting Started

Node.js 22 is recommended to match the deployment environment.

Install dependencies:

```bash
npm ci
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Available Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm test` | Runs the test suite once |
| `npm run test:watch` | Runs tests in watch mode |
| `npm run lint` | Runs ESLint |
| `npm run build` | Creates a production build |
| `npm start` | Starts the production server after a successful build |

## Testing

The automated tests cover the main application behavior.

### Auto Delete Todo

- Initial item order
- Fruit and vegetable movement
- Automatic return after 5 seconds
- Manual return
- Independent item timers
- Timer cancellation
- Timer cleanup on unmount

### Department Summary

- Department grouping
- Male and female counts
- Minimum and maximum age calculation
- Hair color aggregation
- User address mapping
- Empty input handling
- API success and upstream failure responses
- Loading, error, and retry UI states
- Alphabetical display order
- Calculated table values
- Expandable department details

### Landing Page

- Assignment cards are rendered
- Card destinations are correct

Run all validation commands:

```bash
npm test
npm run lint
npm run build
```

## API

### `GET /api/department-summary`

Fetches users from DummyJSON and returns an object grouped by department.

Example response:

```json
{
  "Engineering": {
    "male": 11,
    "female": 8,
    "ageRange": "25-46",
    "hair": {
      "Black": 3,
      "Brown": 2
    },
    "addressUser": {
      "FirstNameLastName": "12345"
    }
  }
}
```

When the upstream service fails or returns an invalid response, the endpoint returns:

```json
{
  "error": "Failed to fetch department summary"
}
```

with HTTP status `502`.

## Design Decisions

- Each todo timer is stored independently in a `Map`.
- A manually returned item has its timer cleared before it is added back to the main list.
- Department aggregation is implemented as a pure transformation function.
- The browser requests only the internal API route instead of calling DummyJSON directly.
- No global state library is required for the current application scope.
- No environment variables are required.

## Deployment

The project is deployed on Vercel:

https://7solutions-frontend-assignment-phi.vercel.app
