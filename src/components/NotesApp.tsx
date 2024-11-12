'use client'

import React, { useState } from 'react';
import { Mic, List, Grid, Plus, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Category {
  name: string;
  count: number;
  color: string;
  textColor: string;
  accentColor: string;
}

interface Note {
  id: number;
  title: string;
  category: string;
  date: string;
  authors: string;
  color: string;
  borderColor: string;
}

const NotesApp = () => {
  const [view, setView] = useState<'list' | 'grid'>('list');
  
  const [categories] = useState<Category[]>([
    { 
      name: 'Machine learning', 
      count: 31, 
      color: 'bg-purple-100', 
      textColor: 'text-purple-800', 
      accentColor: 'border-l-purple-500' 
    },
    { 
      name: 'Computer science', 
      count: 23, 
      color: 'bg-blue-100', 
      textColor: 'text-blue-800', 
      accentColor: 'border-l-blue-500' 
    },
    { 
      name: 'Psychology', 
      count: 18, 
      color: 'bg-yellow-100', 
      textColor: 'text-yellow-800', 
      accentColor: 'border-l-yellow-500' 
    },
    { 
      name: 'Economics', 
      count: 11, 
      color: 'bg-violet-100', 
      textColor: 'text-violet-800', 
      accentColor: 'border-l-violet-500' 
    },
    { 
      name: 'LLMs', 
      count: 9, 
      color: 'bg-green-100', 
      textColor: 'text-green-800', 
      accentColor: 'border-l-green-500' 
    }
  ]);

  const [notes] = useState<Note[]>([
    {
      id: 1,
      title: 'Keeping neural networks simple by minimizing the description length of the weights',
      category: 'Machine learning',
      date: '2024',
      authors: 'Geoffrey E. Hinton, Drew van Camp',
      color: 'bg-blue-50',
      borderColor: 'border-l-4 border-l-blue-500'
    },
    {
      id: 2,
      title: 'Exploring Scaling Trends in LLM Robustness',
      category: 'LLMs',
      date: '2024',
      authors: 'Nikolhaus Howe, Michal Zajac, Ian McKenzie',
      color: 'bg-green-50',
      borderColor: 'border-l-4 border-l-green-500'
    },
    {
      id: 3,
      title: 'VGGHeads: A Large-Scale Synthetic Dataset for 3D Human Heads',
      category: 'Machine learning',
      date: '2024',
      authors: 'Orest Kupyn, Eugene Khvedchenia, Christian Rupprecht',
      color: 'bg-purple-50',
      borderColor: 'border-l-4 border-l-purple-500'
    }
  ]);

  const [queueItems] = useState([
    {
      id: 1,
      title: "Alan Kay's Universal Media Machine",
      category: "Computer science",
      status: "NEW",
      date: "2024"
    },
    {
      id: 2,
      title: "Order Matters: Sequence to sequence for sets",
      category: "Machine learning",
      status: "NEW",
      date: "2024"
    },
    {
      id: 3,
      title: "The Llama 3 Herd of Models",
      category: "LLMs",
      status: "NEW",
      date: "2024"
    }
  ]);

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
            <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 border border-green-200">
              <Plus className="w-4 h-4" />
              <span>Add item</span>
            </button>
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
                  <div className={`w-2 h-2 rounded-full ${category.accentColor.replace('border-l-', 'bg-')}`}></div>
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
                  onClick={() => setView('list')}
                  className={`p-2 rounded ${view === 'list' ? 'bg-gray-200/50' : ''}`}
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 rounded ${view === 'grid' ? 'bg-gray-200/50' : ''}`}
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

            {/* Continue Section */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Continue</h2>
              <div className={`grid ${view === 'grid' ? 'grid-cols-3' : 'grid-cols-1'} gap-4`}>
                {notes.map((note) => (
                  <Card 
                    key={note.id} 
                    className={`${note.color} border-0 ${note.borderColor} shadow-sm hover:shadow-md transition-shadow duration-200`}
                  >
                    <CardContent className="p-4">
                      <div className="text-sm text-gray-500 mb-2">
                        {note.date} • {note.category}
                      </div>
                      <h3 className="font-semibold mb-2 text-gray-800">{note.title}</h3>
                      <div className="text-sm text-gray-600">{note.authors}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Queue Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Your queue</h2>
              <div className="space-y-2">
                {queueItems.map((item, index) => (
                  <div key={item.id} className="flex items-center space-x-4 p-3 bg-white/80 rounded-lg">
                    <span className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full text-sm text-gray-600">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.category} • {item.status} • {item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default NotesApp;