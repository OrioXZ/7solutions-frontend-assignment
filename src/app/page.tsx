import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "7Solutions Frontend Assignment",
  description:
    "Frontend assignment featuring an Auto Delete Todo List and Department Summary API.",
};

const technologies = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Vitest",
  "React Testing Library",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-normal sm:text-4xl">
            7Solutions Frontend Assignment
          </h1>
          <p className="mt-3 text-base leading-7 text-zinc-600">
            This project contains the required Auto Delete Todo assignment and
            the optional Department Summary assignment, with focused automated
            tests for the core behavior and API-driven UI.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <section className="flex flex-col rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-zinc-500">
              Core Assignment
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-950">
              Auto Delete Todo List
            </h2>
            <p className="mt-3 flex-1 text-sm leading-6 text-zinc-600">
              Move fruit and vegetable items into their matching columns, where
              each item automatically returns to the main list after 5 seconds
              unless it is returned manually first.
            </p>
            <Link
              href="/auto-delete-todo"
              className="mt-5 text-sm font-medium text-zinc-950 underline-offset-4 hover:underline"
            >
              Open Auto Delete Todo
            </Link>
          </section>

          <section className="flex flex-col rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold text-zinc-500">
              Optional Assignment
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-950">
              Department Summary
            </h2>
            <p className="mt-3 flex-1 text-sm leading-6 text-zinc-600">
              DummyJSON users are grouped by department through the internal
              API, with the transformation performed in a single pass before
              the summary is displayed.
            </p>
            <Link
              href="/department-summary"
              className="mt-5 text-sm font-medium text-zinc-950 underline-offset-4 hover:underline"
            >
              Open Department Summary
            </Link>
          </section>
        </div>

        <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-zinc-950">Technology</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {technologies.map((technology) => (
              <li
                key={technology}
                className="rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700"
              >
                {technology}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
