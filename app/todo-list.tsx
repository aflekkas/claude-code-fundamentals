"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { supabase } from "../lib/supabase";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const DESCRIPTIONS_KEY = "todo-descriptions";

function loadDescriptions(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(DESCRIPTIONS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveDescriptions(descriptions: Record<string, string>) {
  localStorage.setItem(DESCRIPTIONS_KEY, JSON.stringify(descriptions));
}

export default function TodoList() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setDescriptions(loadDescriptions());
  }, []);

  function updateDescription(id: string, desc: string) {
    const updated = { ...descriptions, [id]: desc };
    setDescriptions(updated);
    saveDescriptions(updated);
  }

  useEffect(() => {
    async function init() {
      console.log("[init] Checking auth session...");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("[init] No session found, redirecting to /login");
        router.push("/login");
        return;
      }
      console.log("[init] Session found for user:", session.user.id, "email:", session.user.email);
      setUserId(session.user.id);

      console.log("[init] Fetching todos from Supabase...");
      const { data, error } = await supabase
        .from("todos")
        .select("id, text, completed")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("[init] Error fetching todos:", error.message, error);
      } else {
        console.log("[init] Fetched", data?.length ?? 0, "todos:", data);
      }
      if (data) setTodos(data);
      setLoading(false);
      console.log("[init] Done loading");
    }
    init();
  }, [router]);

  async function addTodo(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || !userId) {
      console.log("[addTodo] Skipped — text:", JSON.stringify(text), "userId:", userId);
      return;
    }

    console.log("[addTodo] Inserting todo:", { text, userId });
    const { data, error } = await supabase
      .from("todos")
      .insert({ text, completed: false, user_id: userId })
      .select("id, text, completed")
      .single();

    if (error) {
      console.error("[addTodo] Error:", error.message, error);
      return;
    }
    if (!data) {
      console.error("[addTodo] No data returned from insert");
      return;
    }
    console.log("[addTodo] Created todo:", data);
    setTodos([...todos, data]);
    setInput("");
  }

  async function toggleTodo(id: string) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) {
      console.log("[toggleTodo] Todo not found for id:", id);
      return;
    }

    const newCompleted = !todo.completed;
    console.log("[toggleTodo] Toggling todo:", id, "from", todo.completed, "to", newCompleted);
    const { error } = await supabase
      .from("todos")
      .update({ completed: newCompleted })
      .eq("id", id);

    if (error) {
      console.error("[toggleTodo] Error:", error.message, error);
      return;
    }
    console.log("[toggleTodo] Updated successfully");
    if (newCompleted) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    setTodos(
      todos.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t))
    );
  }

  async function deleteTodo(id: string) {
    console.log("[deleteTodo] Deleting todo:", id);
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      console.error("[deleteTodo] Error:", error.message, error);
      return;
    }
    console.log("[deleteTodo] Deleted successfully");
    setTodos(todos.filter((t) => t.id !== id));
    const { [id]: _, ...rest } = descriptions;
    setDescriptions(rest);
    saveDescriptions(rest);
    if (expandedId === id) setExpandedId(null);
  }

  async function signOut() {
    console.log("[signOut] Signing out...");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("[signOut] Error:", error.message, error);
    } else {
      console.log("[signOut] Signed out successfully");
    }
    router.push("/login");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 font-[family-name:var(--font-geist-sans)]">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">To-Do List</h1>
          <button
            onClick={signOut}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Sign out
          </button>
        </div>

        <form onSubmit={addTodo} className="flex gap-2 mb-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </form>

        {todos.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">
            No todos yet. Add one above!
          </p>
        ) : (
          <>
            {todos.filter((t) => !t.completed).length > 0 && (
              <ul className="space-y-2">
                {todos.filter((t) => !t.completed).map((todo) => (
                  <li
                    key={todo.id}
                    className="group rounded-lg border border-gray-200 px-3 py-2"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                      />
                      <button
                        type="button"
                        onClick={() => setExpandedId(expandedId === todo.id ? null : todo.id)}
                        className="flex-1 text-left text-sm text-gray-800 hover:text-blue-600 transition-colors"
                      >
                        {todo.text}
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="text-gray-400 hover:text-red-500 text-sm transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        Delete
                      </button>
                    </div>
                    {expandedId === todo.id && (
                      <div className="mt-2 ml-7">
                        <textarea
                          value={descriptions[todo.id] || ""}
                          onChange={(e) => updateDescription(todo.id, e.target.value)}
                          placeholder="Add a description..."
                          rows={2}
                          className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {todos.filter((t) => t.completed).length > 0 && (
              <div className="mt-4">
                <button
                  onClick={() => setShowCompleted(!showCompleted)}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg
                    className={`h-3 w-3 transition-transform ${showCompleted ? "rotate-90" : ""}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M6.293 4.293a1 1 0 011.414 0L14 10.586l-6.293 6.293a1 1 0 01-1.414-1.414L11.172 10.5 6.293 5.707a1 1 0 010-1.414z" />
                  </svg>
                  {todos.filter((t) => t.completed).length} completed
                </button>

                {showCompleted && (
                  <ul className="mt-2 space-y-2">
                    {todos.filter((t) => t.completed).map((todo) => (
                      <li
                        key={todo.id}
                        className="group rounded-lg border border-gray-200 px-3 py-2"
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo.id)}
                            className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                          />
                          <button
                            type="button"
                            onClick={() => setExpandedId(expandedId === todo.id ? null : todo.id)}
                            className="flex-1 text-left text-sm line-through text-gray-400 hover:text-gray-500 transition-colors"
                          >
                            {todo.text}
                          </button>
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className="text-gray-400 hover:text-red-500 text-sm transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                          >
                            Delete
                          </button>
                        </div>
                        {expandedId === todo.id && (
                          <div className="mt-2 ml-7">
                            <textarea
                              value={descriptions[todo.id] || ""}
                              onChange={(e) => updateDescription(todo.id, e.target.value)}
                              placeholder="Add a description..."
                              rows={2}
                              className="w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            />
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
