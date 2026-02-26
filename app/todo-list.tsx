"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { supabase } from "../lib/supabase";
import { Card, CardHeader, CardTitle, CardAction, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  description: string;
}

export default function TodoList() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);
  const totalCount = todos.length;
  const completedCount = completedTodos.length;

  async function updateDescription(id: string, desc: string) {
    setTodos(todos.map((t) => (t.id === id ? { ...t, description: desc } : t)));
    const { error } = await supabase
      .from("todos")
      .update({ description: desc })
      .eq("id", id);
    if (error) {
      console.error("[updateDescription] Error:", error.message, error);
    }
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
        .select("id, text, completed, description")
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
      .select("id, text, completed, description")
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
      <div className="flex items-center justify-center min-h-screen px-4 font-[family-name:var(--font-geist-sans)] bg-gradient-to-br from-slate-50 to-blue-50/50">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start sm:items-center justify-center min-h-screen px-4 py-6 sm:py-0 font-[family-name:var(--font-geist-sans)] bg-gradient-to-br from-slate-50 to-blue-50/50">
      <Card className="w-full max-w-md rounded-2xl shadow-xl shadow-gray-200/50">
        {/* Header */}
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-xl tracking-tight">To-Do List</CardTitle>
          <CardAction>
            <Button variant="outline" size="sm" onClick={signOut}>
              Sign out
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Progress indicator */}
          {totalCount > 0 && (
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>{completedCount} of {totalCount} tasks completed</span>
                <span>{Math.round((completedCount / totalCount) * 100)}%</span>
              </div>
              <Progress
                value={totalCount > 0 ? (completedCount / totalCount) * 100 : 0}
                className="h-1.5"
              />
            </div>
          )}

          {/* Add task form */}
          <form onSubmit={addTodo} className="flex gap-2">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 rounded-xl"
            />
            <Button
              type="submit"
              size="icon"
              className="rounded-xl shrink-0"
              aria-label="Add task"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </Button>
          </form>

          {/* Empty state */}
          {todos.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
              </svg>
              <p className="text-muted-foreground text-sm font-medium">No tasks yet</p>
              <p className="text-gray-300 text-xs mt-1">Add your first task above to get started</p>
            </div>
          ) : (
            <>
              {/* Active todos */}
              {activeTodos.length > 0 && (
                <ul className="space-y-0.5">
                  {activeTodos.map((todo) => (
                    <li key={todo.id}>
                      <Collapsible
                        open={expandedId === todo.id}
                        onOpenChange={(open) => setExpandedId(open ? todo.id : null)}
                      >
                        <div className="group flex items-center gap-3 rounded-xl hover:bg-gray-50/80 px-3 py-2.5 transition-colors">
                          <Checkbox
                            checked={false}
                            onCheckedChange={() => toggleTodo(todo.id)}
                            className="rounded-full"
                            aria-label={`Complete "${todo.text}"`}
                          />
                          <CollapsibleTrigger asChild>
                            <button
                              type="button"
                              className="flex-1 text-left text-sm text-gray-700 hover:text-gray-900 transition-colors"
                            >
                              {todo.text}
                            </button>
                          </CollapsibleTrigger>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => deleteTodo(todo.id)}
                            className="text-gray-300 hover:text-red-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-red-50"
                            aria-label={`Delete "${todo.text}"`}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </Button>
                        </div>
                        <CollapsibleContent>
                          <div className="ml-[30px] px-3 pb-2">
                            <Textarea
                              value={todo.description || ""}
                              onChange={(e) => updateDescription(todo.id, e.target.value)}
                              placeholder="Add a description..."
                              rows={2}
                              className="min-h-0 resize-none bg-gray-50 border-gray-100"
                            />
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </li>
                  ))}
                </ul>
              )}

              {/* Completed section */}
              {completedTodos.length > 0 && (
                <Collapsible open={showCompleted} onOpenChange={setShowCompleted}>
                  <div className={activeTodos.length > 0 ? "pt-3 border-t border-gray-100" : ""}>
                    <CollapsibleTrigger asChild>
                      <button className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1">
                        <svg
                          className={`h-3 w-3 transition-transform duration-200 ${showCompleted ? "rotate-90" : ""}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M6.293 4.293a1 1 0 011.414 0L14 10.586l-6.293 6.293a1 1 0 01-1.414-1.414L11.172 10.5 6.293 5.707a1 1 0 010-1.414z" />
                        </svg>
                        {completedTodos.length} completed
                      </button>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <ul className="mt-1 space-y-0.5">
                        {completedTodos.map((todo) => (
                          <li key={todo.id}>
                            <Collapsible
                              open={expandedId === todo.id}
                              onOpenChange={(open) => setExpandedId(open ? todo.id : null)}
                            >
                              <div className="group flex items-center gap-3 rounded-xl px-3 py-2.5 opacity-50 hover:opacity-70 transition-opacity">
                                <Checkbox
                                  checked={true}
                                  onCheckedChange={() => toggleTodo(todo.id)}
                                  className="rounded-full"
                                  aria-label={`Uncomplete "${todo.text}"`}
                                />
                                <CollapsibleTrigger asChild>
                                  <button
                                    type="button"
                                    className="flex-1 text-left text-sm line-through text-gray-400 hover:text-gray-500 transition-colors"
                                  >
                                    {todo.text}
                                  </button>
                                </CollapsibleTrigger>
                                <Button
                                  variant="ghost"
                                  size="icon-xs"
                                  onClick={() => deleteTodo(todo.id)}
                                  className="text-gray-300 hover:text-red-400 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-red-50"
                                  aria-label={`Delete "${todo.text}"`}
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                  </svg>
                                </Button>
                              </div>
                              <CollapsibleContent>
                                <div className="ml-[30px] px-3 pb-2">
                                  <Textarea
                                    value={todo.description || ""}
                                    onChange={(e) => updateDescription(todo.id, e.target.value)}
                                    placeholder="Add a description..."
                                    rows={2}
                                    className="min-h-0 resize-none bg-gray-50 border-gray-100"
                                  />
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </li>
                        ))}
                      </ul>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
