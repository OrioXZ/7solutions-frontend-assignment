"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { initialTodoItems } from "@/data/todo-items";
import type { TodoItem, TodoType } from "@/types/todo";

const AUTO_RETURN_DELAY_MS = 5000;
const AssignmentHomeLink = process.env.NODE_ENV === "test" ? "a" : Link;

type TodoColumnProps = {
  title: string;
  items: TodoItem[];
  onItemClick: (item: TodoItem) => void;
};

function TodoColumn({ title, items, onItemClick }: TodoColumnProps) {
  return (
    <section className="flex min-h-80 flex-col rounded-lg border border-zinc-200 bg-white shadow-sm">
      <h2 className="border-b border-zinc-200 px-4 py-3 text-center text-lg font-semibold text-zinc-900">
        {title}
      </h2>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onItemClick(item)}
            className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3 text-left font-medium text-zinc-800 transition hover:border-zinc-300 hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          >
            {item.name}
          </button>
        ))}
      </div>
    </section>
  );
}

export default function AutoDeleteTodo() {
  const [mainItems, setMainItems] = useState<TodoItem[]>(initialTodoItems);
  const [fruitItems, setFruitItems] = useState<TodoItem[]>([]);
  const [vegetableItems, setVegetableItems] = useState<TodoItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  useEffect(() => {
    const timers = timersRef.current;

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const removeFromTypeColumn = (item: TodoItem) => {
    if (item.type === "Fruit") {
      setFruitItems((items) => items.filter((current) => current.id !== item.id));
      return;
    }

    setVegetableItems((items) =>
      items.filter((current) => current.id !== item.id),
    );
  };

  const addToTypeColumn = (item: TodoItem) => {
    if (item.type === "Fruit") {
      setFruitItems((items) => [...items, item]);
      return;
    }

    setVegetableItems((items) => [...items, item]);
  };

  const clearItemTimer = (itemId: string) => {
    const timer = timersRef.current.get(itemId);

    if (!timer) {
      return;
    }

    clearTimeout(timer);
    timersRef.current.delete(itemId);
  };

  const returnToMainList = (item: TodoItem) => {
    removeFromTypeColumn(item);
    setMainItems((items) =>
      items.some((current) => current.id === item.id) ? items : [...items, item],
    );
  };

  const startAutoReturnTimer = (item: TodoItem) => {
    clearItemTimer(item.id);

    const timer = setTimeout(() => {
      timersRef.current.delete(item.id);
      returnToMainList(item);
    }, AUTO_RETURN_DELAY_MS);

    timersRef.current.set(item.id, timer);
  };

  const moveFromMainList = (item: TodoItem) => {
    setMainItems((items) => items.filter((current) => current.id !== item.id));
    addToTypeColumn(item);
    startAutoReturnTimer(item);
  };

  const moveBackManually = (item: TodoItem) => {
    clearItemTimer(item.id);
    returnToMainList(item);
  };

  const typedColumns: { title: TodoType; items: TodoItem[] }[] = [
    { title: "Fruit", items: fruitItems },
    { title: "Vegetable", items: vegetableItems },
  ];

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-8 text-zinc-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-3">
          <AssignmentHomeLink
            href="/"
            className="text-sm font-medium text-zinc-600 underline-offset-4 hover:text-zinc-950 hover:underline"
          >
            ← Back to Assignment Home
          </AssignmentHomeLink>
          <h1 className="text-3xl font-bold tracking-normal sm:text-4xl">
            Auto Delete Todo List
          </h1>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <TodoColumn
            title="Main List"
            items={mainItems}
            onItemClick={moveFromMainList}
          />
          {typedColumns.map((column) => (
            <TodoColumn
              key={column.title}
              title={column.title}
              items={column.items}
              onItemClick={moveBackManually}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
