"use client";

import React, { useState, useEffect } from "react";
import { Mic, List, Grid, Plus, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NoteForm from "./NoteForm";
import { Note, subscribeToNotes, addNote } from "@/lib/firebaseutils";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteNote, updateNote } from "@/lib/firebaseutils";

interface Category {
  name: string;
  count: number;
  color: string;
  textColor: string;
  accentColor: string;
}

interface NoteFormData {
  title: string;
  content: string;
  category: string;
  authors: string;
}

const NotesApp = () => {
  const [view, setView] = useState<"list" | "grid">("list");
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories] = useState<Category[]>([
    {
      name: "Machine learning",
      count: 31,
      color: "bg-purple-100",
      textColor: "text-purple-800",
      accentColor: "border-l-purple-500",
    },
    // ... other categories
  ]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToNotes((updatedNotes) => {
      setNotes(updatedNotes);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleAddNote = async (data: NoteFormData) => {
    try {
      const categoryInfo = categories.find((c) => c.name === data.category);

      await addNote({
        title: data.title,
        content: data.content,
        category: data.category,
        authors: data.authors,
        date: new Date().getFullYear().toString(),
        color: categoryInfo?.color || "bg-gray-50",
        borderColor:
          categoryInfo?.accentColor || "border-l-4 border-l-gray-500",
      });

      setIsAddDialogOpen(false); // Close dialog after successful creation
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote(noteId);
      // Firebase subscription will automatically update the UI
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F1EA]">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-semibold text-gray-800">My Library</h1>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">Reading list</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-200/50">
              <Mic className="w-5 h-5 text-gray-600" />
            </button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 border border-green-200">
                  <Plus className="w-4 h-4" />
                  <span>Add item</span>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Note</DialogTitle>
                </DialogHeader>
                <NoteForm categories={categories} onSubmit={handleAddNote} />
              </DialogContent>
            </Dialog>
          </div>
        </header>

        {/* Main content */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-64 space-y-1">
            <div className="font-medium text-gray-500 mb-2">Finder</div>
            {categories.map((category) => (
              <div
                key={category.name}
                className="flex items-center justify-between p-2 rounded-md hover:bg-white/50 cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${category.accentColor.replace(
                      "border-l-",
                      "bg-"
                    )}`}
                  ></div>
                  <span className="text-gray-700">{category.name}</span>
                </div>
                <span className="text-gray-500 text-sm">{category.count}</span>
              </div>
            ))}
          </aside>

          {/* Notes Grid/List */}
          <main className="flex-1">
            <div className="flex justify-between mb-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => setView("list")}
                  className={`p-2 rounded ${
                    view === "list" ? "bg-gray-200/50" : ""
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 rounded ${
                    view === "grid" ? "bg-gray-200/50" : ""
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
              </div>
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search notes..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white/80"
                />
              </div>
            </div>

            {/* Notes Section */}
            {notes.length > 0 ? (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">
                  Continue
                </h2>
                <div
                  className={`grid ${
                    view === "grid" ? "grid-cols-3" : "grid-cols-1"
                  } gap-4`}
                >
                  {notes.map((note) => (
                    <Card
                      key={note.id}
                      className={`${note.color} border-0 ${note.borderColor} shadow-sm hover:shadow-md transition-shadow duration-200`}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="text-sm text-gray-500 mb-2">
                              {note.date} • {note.category}
                            </div>
                            <h3 className="font-semibold mb-2 text-gray-800">
                              {note.title}
                            </h3>
                            <div className="text-sm text-gray-600">
                              {note.authors}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="p-2 hover:bg-black/5 rounded-full">
                              <MoreVertical className="h-4 w-4 text-gray-500" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleEditNote(note)}
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteNote(note.id)}
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No notes yet. Click the &quot;Add item&quot; button to create
                your first note.
              </div>
            )}
          </main>
        </div>
      </div>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          <NoteForm
            categories={categories}
            onSubmit={async (data) => {
              if (editingNote) {
                try {
                  await updateNote(editingNote.id, {
                    ...data,
                    color:
                      categories.find((c) => c.name === data.category)?.color ||
                      "bg-gray-50",
                    borderColor:
                      categories.find((c) => c.name === data.category)
                        ?.accentColor || "border-l-4 border-l-gray-500",
                  });
                  setIsEditDialogOpen(false);
                } catch (error) {
                  console.error("Error updating note:", error);
                }
              }
            }}
            initialData={editingNote || undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotesApp;
