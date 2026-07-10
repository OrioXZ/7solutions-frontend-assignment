import type { Metadata } from "next";
import Link from "next/link";
import DepartmentSummaryView from "@/components/department-summary-view";

export const metadata: Metadata = {
  title: "Department Summary",
  description:
    "Reviewer-friendly UI for the optional API assignment that summarizes DummyJSON users by department.",
};

export default function DepartmentSummaryPage() {
  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-3">
          <nav
            aria-label="Assignment navigation"
            className="flex flex-col gap-2 text-sm font-medium text-zinc-600 sm:flex-row"
          >
            <Link
              href="/"
              className="underline-offset-4 hover:text-zinc-950 hover:underline"
            >
              Back to Assignment Home
            </Link>
            <Link
              href="/auto-delete-todo"
              className="underline-offset-4 hover:text-zinc-950 hover:underline"
            >
              Open Auto Delete Todo
            </Link>
          </nav>
          <div>
            <h1 className="text-3xl font-bold tracking-normal sm:text-4xl">
              Department Summary
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">
              Optional API assignment output grouped by department from the
              internal summary endpoint.
            </p>
          </div>
        </header>

        <DepartmentSummaryView />
      </div>
    </main>
  );
}
