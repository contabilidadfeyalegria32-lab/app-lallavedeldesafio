import React, { useState } from 'react';
import { NoteItem } from '../types';
import { FileText, Plus, Search, Folder, Tag, Trash2, Edit2, CheckSquare, Square, Check, Sparkles } from 'lucide-react';

interface NotesAppProps {
  notes: NoteItem[];
  onAddNote: (note: NoteItem) => void;
  onUpdateNote: (note: NoteItem) => void;
  onDeleteNote: (id: string) => void;
}

export const NotesApp: React.FC<NotesAppProps> = ({
  notes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [folder, setFolder] = useState('Salud & Rutinas');
  const [tagInput, setTagInput] = useState('');

  const folders = Array.from(new Set(notes.map((n) => n.folder)));

  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder === 'all' || n.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (editingNote) {
      const updated: NoteItem = {
        ...editingNote,
        title: title.trim(),
        content: content.trim(),
        folder,
        tags: tags.length > 0 ? tags : editingNote.tags,
        updatedAt: new Date().toLocaleString(),
      };
      onUpdateNote(updated);
      setEditingNote(null);
    } else {
      const newNote: NoteItem = {
        id: Date.now().toString(),
        title: title.trim(),
        content: content.trim(),
        folder: folder || 'General',
        tags: tags.length > 0 ? tags : ['nota'],
        color: '#f8fafc',
        updatedAt: new Date().toLocaleString(),
      };
      onAddNote(newNote);
    }

    setTitle('');
    setContent('');
    setTagInput('');
  };

  const handleStartEdit = (note: NoteItem) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setFolder(note.folder);
    setTagInput(note.tags.join(', '));
  };

  const handleToggleChecklist = (note: NoteItem, chkId: string) => {
    if (!note.checklists) return;
    const updatedChecklists = note.checklists.map((item) =>
      item.id === chkId ? { ...item, done: !item.done } : item
    );
    onUpdateNote({ ...note, checklists: updatedChecklists });
  };

  return (
    <div className="bg-white rounded-2xl border border-rose-200/80 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
      
      {/* Header Banner - Soft Rose Pink Pastel */}
      <div className="bg-gradient-to-r from-rose-100 via-pink-50 to-rose-50 rounded-2xl border border-rose-200/90 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-200/80 text-rose-950 text-xs font-bold mb-1">
            <FileText className="w-3.5 h-3.5 text-rose-700" />
            <span>Bloc de Notas Privado</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Notas y Apuntes de Estudio</h2>
          <p className="text-xs text-slate-700 font-medium mt-0.5">
            Organiza tus pensamientos, listas de tareas, ideas y reflexiones con carpetas y etiquetas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Editor Form */}
        <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>{editingNote ? 'Editar Nota' : 'Crear Nueva Nota'}</span>
            </h3>
            {editingNote && (
              <button
                onClick={() => {
                  setEditingNote(null);
                  setTitle('');
                  setContent('');
                }}
                className="text-[11px] font-semibold text-rose-600 hover:underline"
              >
                Cancelar Edición
              </button>
            )}
          </div>

          <form onSubmit={handleSaveNote} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Título</label>
              <input
                type="text"
                placeholder="Título de la nota..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Carpeta</label>
              <input
                type="text"
                placeholder="Ej. Salud & Rutinas, Proyectos"
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contenido de la Nota</label>
              <textarea
                rows={5}
                placeholder="Escribe tus reflexiones, ideas o listas..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Etiquetas (separadas por coma)</label>
              <input
                type="text"
                placeholder="ej. hábito, lectura, pendiente"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {editingNote ? 'Actualizar Nota' : 'Guardar Nota'}
            </button>
          </form>
        </div>

        {/* Right Column: Search & Notes List */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Search bar & Folder filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar en mis notas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-medium"
            >
              <option value="all">📁 Todas las Carpetas</option>
              {folders.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredNotes.length === 0 ? (
              <div className="col-span-2 text-center py-10 text-slate-400">
                <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs">No hay notas encontradas.</p>
              </div>
            ) : (
              filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between hover:border-indigo-300 transition-all shadow-2xs group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                        {note.folder}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{note.updatedAt}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mb-1">{note.title}</h4>
                    <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed mb-3">
                      {note.content}
                    </p>

                    {/* Checklists if any */}
                    {note.checklists && (
                      <div className="space-y-1 my-2 bg-white p-2 rounded-xl border border-slate-200/60">
                        {note.checklists.map((chk) => (
                          <div
                            key={chk.id}
                            onClick={() => handleToggleChecklist(note, chk.id)}
                            className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer"
                          >
                            {chk.done ? (
                              <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Square className="w-3.5 h-3.5 text-slate-400" />
                            )}
                            <span className={chk.done ? 'line-through text-slate-400' : ''}>
                              {chk.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {note.tags.map((t, idx) => (
                        <span key={idx} className="text-[9px] font-semibold text-slate-500 bg-white px-1.5 py-0.5 rounded-md border border-slate-200">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1 pt-3 border-t border-slate-200/60 mt-3">
                    <button
                      onClick={() => handleStartEdit(note)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-white"
                      title="Editar"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-white"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
