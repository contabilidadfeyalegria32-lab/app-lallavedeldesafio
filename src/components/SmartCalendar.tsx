import React, { useState } from 'react';
import { CalendarEvent, ChallengeCategory } from '../types';
import { Calendar as CalendarIcon, Plus, Clock, CheckCircle2, Circle, Bell, Tag, ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface SmartCalendarProps {
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onToggleEvent: (id: string) => void;
}

export const SmartCalendar: React.FC<SmartCalendarProps> = ({
  events,
  onAddEvent,
  onToggleEvent,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Event Form State
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00 AM');
  const [category, setCategory] = useState<ChallengeCategory>('bienestar');
  const [color, setColor] = useState('#4f46e5');
  const [notes, setNotes] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEv: CalendarEvent = {
      id: Date.now().toString(),
      title: title.trim(),
      date: selectedDateStr,
      time: time,
      type: 'custom',
      category: category,
      color: color,
      completed: false,
      notes: notes.trim(),
    };

    onAddEvent(newEv);
    setShowAddModal(false);
    setTitle('');
    setNotes('');
  };

  const selectedDayEvents = events.filter((ev) => ev.date === selectedDateStr);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold mb-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Calendario Inteligente de Hábitos</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Programación y Alarmas</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Organiza tus eventos, citas, recordatorios y desafíos diarios sincronizados.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Evento a la Fecha</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Month Grid */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Month Navigation */}
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-800">
              {monthNames[month]} {year}
            </h3>
            <button
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-white rounded-lg text-slate-600 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 py-1">
            <span>Dom</span>
            <span>Lun</span>
            <span>Mar</span>
            <span>Mié</span>
            <span>Jue</span>
            <span>Vie</span>
            <span>Sáb</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Blank leading slots */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`blank-${i}`} className="h-14 sm:h-16 bg-slate-50/40 rounded-xl" />
            ))}

            {/* Day slots */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateFormatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isSelected = dateFormatted === selectedDateStr;
              const dayEvents = events.filter((e) => e.date === dateFormatted);

              return (
                <div
                  key={dayNum}
                  onClick={() => setSelectedDateStr(dateFormatted)}
                  className={`h-14 sm:h-16 p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md scale-105 z-10'
                      : 'bg-white border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                    {dayNum}
                  </span>

                  {/* Indicators for events on this day */}
                  <div className="flex flex-wrap gap-1">
                    {dayEvents.slice(0, 3).map((ev) => (
                      <span
                        key={ev.id}
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: isSelected ? '#ffffff' : ev.color || '#4f46e5' }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Day Schedule Details */}
        <div className="lg:col-span-5 bg-slate-50/80 rounded-2xl p-5 border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Día Seleccionado</span>
              <h4 className="text-base font-bold text-slate-900">
                {selectedDateStr}
              </h4>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
              {selectedDayEvents.length} Actividades
            </span>
          </div>

          {/* Event items for selected day */}
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {selectedDayEvents.length === 0 ? (
              <div className="text-center py-8 text-slate-400 space-y-2">
                <Bell className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">No hay eventos programados para este día.</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="text-xs text-indigo-600 font-semibold hover:underline"
                >
                  + Agregar primer evento
                </button>
              </div>
            ) : (
              selectedDayEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-2xs flex items-start justify-between gap-3"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => onToggleEvent(ev.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 cursor-pointer"
                    >
                      {ev.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <h5 className={`text-xs font-bold ${ev.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {ev.title}
                      </h5>
                      <p className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {ev.time || 'Todo el día'}
                      </p>
                      {ev.notes && (
                        <p className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-100 mt-1">
                          {ev.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <span
                    className="w-3 h-3 rounded-full shrink-0 mt-1"
                    style={{ backgroundColor: ev.color || '#4f46e5' }}
                  />
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Nuevo Evento para {selectedDateStr}
            </h3>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Título de la Actividad</label>
                <input
                  type="text"
                  placeholder="Ej. Ir al gimnasio, Reto de lectura, Cita médica"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hora</label>
                  <input
                    type="text"
                    placeholder="08:00 AM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-xl bg-white"
                  >
                    <option value="bienestar">Bienestar</option>
                    <option value="salud">Salud</option>
                    <option value="educacion">Educación</option>
                    <option value="entretenimiento">Entretenimiento</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Color del Identificador</label>
                <div className="flex gap-2">
                  {['#059669', '#2563eb', '#7c3aed', '#d97706', '#e11d48'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                        color === c ? 'scale-125 border-2 border-slate-900' : ''
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notas de la Actividad</label>
                <textarea
                  rows={2}
                  placeholder="Instrucciones o recordatorios..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs"
                >
                  Guardar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
