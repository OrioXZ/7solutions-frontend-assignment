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

Node.js 24 is recommended for local development.

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

## Testing Strategy

The test suite focuses on behaviors that are most likely to break during future changes.

### Auto Delete Todo

The todo tests cover:

- The exact initial item order from the assignment
- Moving fruit and vegetable items to the correct columns
- Automatic return after exactly 5 seconds
- Manual return before the timer expires
- Independent timers for multiple items
- Timer cancellation after manual return
- Cleanup of active timers when the component unmounts

Fake timers are used instead of real delays, keeping the tests deterministic and fast.

### Department Summary Transformation

The transformation tests cover:

- Grouping users by department
- Male and female counts
- Minimum and maximum age calculation
- Hair color aggregation
- Concatenated name to postal code mapping
- Multiple departments
- Empty input

The transformer is tested separately as a pure function so its business logic can be verified without network or UI dependencies.

### API Route

The API route tests mock the upstream `fetch` request and verify:

- The expected DummyJSON URL is requested
- A successful response is transformed correctly
- Upstream failures return HTTP `502`
- A stable error response is returned to the client

No real external requests are made during automated tests.

### Department Summary UI

The UI tests cover:

- Loading state
- Rendered department data and calculated totals
- Alphabetical department order
- Expandable hair color and address details
- Error state
- Retry behavior after a failed request

### Landing Page

The landing page tests verify that both assignment cards are rendered and link to the correct routes.

The project intentionally does not include end-to-end browser tests because the assignment behavior is already covered at the component, transformation, and route levels. Final user flows were also verified manually on the deployed application.

Run all validation commands:

```bash
npm test
npm run lint
npm run build
```

## Performance Considerations

The optional department transformation was designed with performance in mind.

### Single-pass aggregation

All department summary fields are calculated within one pass over the users:

- Gender counts
- Minimum and maximum age
- Hair color counts
- User address mapping

This gives the transformation a time complexity of:

```text
O(n)
```

where `n` is the number of users.

The implementation avoids repeated filtering or scanning for each department. Department summaries and hair color counts are updated through direct object lookups during the same loop.

### Response size

The DummyJSON request uses `select` to request only the fields required by the transformation:

```text
firstName,lastName,age,gender,hair,address,company
```

This avoids downloading unused user fields.

### Memory usage

Additional temporary storage for age bounds is proportional to the number of departments. The final address mapping necessarily grows with the number of users because it is part of the required output.

No time-based performance assertion or benchmark is included in the normal test suite because fixed duration limits can become unreliable across different machines and CI environments.

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
