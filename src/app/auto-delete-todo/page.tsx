import type { Metadata } from "next";
import AutoDeleteTodo from "@/components/auto-delete-todo";

export const metadata: Metadata = {
  title: "Auto Delete Todo List",
  description:
    "Core assignment demonstrating timed movement of fruit and vegetable items.",
};

export default function AutoDeleteTodoPage() {
  return <AutoDeleteTodo />;
}
