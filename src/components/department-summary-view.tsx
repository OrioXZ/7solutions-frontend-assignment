"use client";

import { useEffect, useMemo, useState } from "react";
import type { DepartmentSummaryMap } from "@/types/dummy-user";

type LoadState =
  | { status: "loading"; data: null }
  | { status: "success"; data: DepartmentSummaryMap }
  | { status: "error"; data: null };

function isSummaryMap(value: unknown): value is DepartmentSummaryMap {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function countEntries(value: Record<string, unknown>) {
  return Object.keys(value).length;
}

export default function DepartmentSummaryView() {
  const [loadState, setLoadState] = useState<LoadState>({
    status: "loading",
    data: null,
  });
  const [requestKey, setRequestKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function loadSummary() {
      setLoadState({ status: "loading", data: null });

      try {
        const response = await fetch("/api/department-summary", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Department summary request failed");
        }

        const data: unknown = await response.json();

        if (!isSummaryMap(data)) {
          throw new Error("Department summary response is invalid");
        }

        if (isMounted) {
          setLoadState({ status: "success", data });
        }
      } catch (error) {
        if (isMounted && !(error instanceof DOMException && error.name === "AbortError")) {
          setLoadState({ status: "error", data: null });
        }
      }
    }

    loadSummary();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [requestKey]);

  const departments = useMemo(() => {
    if (loadState.status !== "success") {
      return [];
    }

    return Object.entries(loadState.data).sort(([left], [right]) =>
      left.localeCompare(right),
    );
  }, [loadState]);

  if (loadState.status === "loading") {
    return (
      <section
        aria-label="Department summary status"
        className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <p className="font-medium text-zinc-700">Loading department summary...</p>
      </section>
    );
  }

  if (loadState.status === "error") {
    return (
      <section
        aria-label="Department summary status"
        className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-xl font-semibold text-zinc-950">
          Unable to load department summary
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          Please try again in a moment.
        </p>
        <button
          type="button"
          onClick={() => setRequestKey((key) => key + 1)}
          className="mt-4 rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500"
        >
          Retry
        </button>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6" aria-labelledby="summary-heading">
      <h2 id="summary-heading" className="text-2xl font-semibold text-zinc-950">
        Department Overview
      </h2>

      <div className="overflow-x-auto rounded-lg border border-zinc-200 bg-white shadow-sm">
        <table className="min-w-[760px] w-full border-collapse text-left text-sm">
          <thead className="bg-zinc-50 text-zinc-700">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">
                Department
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Male
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Female
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Total
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Age Range
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Hair Colors
              </th>
              <th scope="col" className="px-4 py-3 font-semibold">
                Address Users
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {departments.map(([department, summary]) => (
              <tr key={department}>
                <th scope="row" className="px-4 py-3 font-medium text-zinc-950">
                  {department}
                </th>
                <td className="px-4 py-3 text-zinc-700">{summary.male}</td>
                <td className="px-4 py-3 text-zinc-700">{summary.female}</td>
                <td className="px-4 py-3 text-zinc-700">
                  {summary.male + summary.female}
                </td>
                <td className="px-4 py-3 text-zinc-700">{summary.ageRange}</td>
                <td className="px-4 py-3 text-zinc-700">
                  {countEntries(summary.hair)}
                </td>
                <td className="px-4 py-3 text-zinc-700">
                  {countEntries(summary.addressUser)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3">
        {departments.map(([department, summary]) => (
          <details
            key={department}
            aria-label={`${department} details`}
            className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
          >
            <summary className="cursor-pointer text-lg font-semibold text-zinc-950">
              {department}
            </summary>

            <div className="mt-4 grid gap-6 md:grid-cols-2">
              <section aria-labelledby={`${department}-hair-heading`}>
                <h3
                  id={`${department}-hair-heading`}
                  className="font-semibold text-zinc-900"
                >
                  Hair Colors
                </h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
                  {Object.entries(summary.hair).map(([color, count]) => (
                    <li key={color}>
                      {color}: {count}
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby={`${department}-addresses-heading`}>
                <h3
                  id={`${department}-addresses-heading`}
                  className="font-semibold text-zinc-900"
                >
                  Address Users
                </h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
                  {Object.entries(summary.addressUser).map(([name, postalCode]) => (
                    <li key={name}>
                      {name}: {postalCode}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
