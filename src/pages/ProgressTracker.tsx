import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface WeightEntry {
  id: string
  date: string
  weight: number
  notes: string
}

interface ProgressStats {
  currentWeight: number
  startWeight: number
  totalChange: number
  weeklyChange: number
  goalWeight: number
  progressToGoal: number
}

const ProgressTracker: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [entries, setEntries] = useState<WeightEntry[]>([])
  const [newWeight, setNewWeight] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [stats, setStats] = useState<ProgressStats | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('month')

  // Load entries from localStorage
  useEffect(() => {
    const storedEntries = localStorage.getItem('weight_entries')
    if (storedEntries) {
      setEntries(JSON.parse(storedEntries))
    }
  }, [])

  // Calculate stats
  useEffect(() => {
    if (entries.length === 0) return

    const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    const currentWeight = sortedEntries[sortedEntries.length - 1].weight
    const startWeight = sortedEntries[0].weight
    const totalChange = currentWeight - startWeight
    const goalWeight = startWeight - 10 // Assuming 10kg goal

    // Calculate weekly change
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const weekAgoEntry = sortedEntries.find((e) => new Date(e.date) <= oneWeekAgo)
    const weeklyChange = weekAgoEntry ? currentWeight - weekAgoEntry.weight : totalChange

    const progressToGoal = Math.max(0, Math.min(100, ((startWeight - currentWeight) / (startWeight - goalWeight)) * 100))

    setStats({
      currentWeight,
      startWeight,
      totalChange,
      weeklyChange,
      goalWeight,
      progressToGoal,
    })
  }, [entries])

  // Add weight entry
  const handleAddEntry = () => {
    if (!newWeight) return

    const entry: WeightEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(newWeight),
      notes: newNotes,
    }

    const updatedEntries = [...entries, entry]
    setEntries(updatedEntries)
    localStorage.setItem('weight_entries', JSON.stringify(updatedEntries))

    setNewWeight('')
    setNewNotes('')
  }

  // Delete entry
  const handleDeleteEntry = (id: string) => {
    const updatedEntries = entries.filter((e) => e.id !== id)
    setEntries(updatedEntries)
    localStorage.setItem('weight_entries', JSON.stringify(updatedEntries))
  }

  // Filter entries by period
  const getFilteredEntries = () => {
    const now = new Date()
    const filtered = entries.filter((entry) => {
      const entryDate = new Date(entry.date)
      switch (selectedPeriod) {
        case 'week':
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return entryDate >= oneWeekAgo
        case 'month':
          const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          return entryDate >= oneMonthAgo
        case 'all':
          return true
      }
    })
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  const filteredEntries = getFilteredEntries()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Progress Tracker</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Current Weight */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 shadow-lg">
              <p className="text-blue-100 text-sm font-medium mb-2">Current Weight</p>
              <p className="text-4xl font-bold text-white mb-2">{stats.currentWeight.toFixed(1)}</p>
              <p className="text-blue-100 text-sm">kg</p>
            </div>

            {/* Total Change */}
            <div className={`bg-gradient-to-br rounded-2xl p-6 shadow-lg ${stats.totalChange < 0 ? 'from-green-600 to-green-700' : 'from-orange-600 to-orange-700'}`}>
              <p className="text-white text-sm font-medium mb-2">Total Change</p>
              <p className={`text-4xl font-bold mb-2 ${stats.totalChange < 0 ? 'text-green-200' : 'text-orange-200'}`}>
                {stats.totalChange > 0 ? '+' : ''}{stats.totalChange.toFixed(1)}
              </p>
              <p className="text-white text-sm">kg</p>
            </div>

            {/* Weekly Change */}
            <div className={`bg-gradient-to-br rounded-2xl p-6 shadow-lg ${stats.weeklyChange < 0 ? 'from-purple-600 to-purple-700' : 'from-yellow-600 to-yellow-700'}`}>
              <p className="text-white text-sm font-medium mb-2">Weekly Change</p>
              <p className={`text-4xl font-bold mb-2 ${stats.weeklyChange < 0 ? 'text-purple-200' : 'text-yellow-200'}`}>
                {stats.weeklyChange > 0 ? '+' : ''}{stats.weeklyChange.toFixed(1)}
              </p>
              <p className="text-white text-sm">kg</p>
            </div>

            {/* Goal Weight */}
            <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-2xl p-6 shadow-lg">
              <p className="text-pink-100 text-sm font-medium mb-2">Goal Weight</p>
              <p className="text-4xl font-bold text-white mb-2">{stats.goalWeight.toFixed(1)}</p>
              <p className="text-pink-100 text-sm">kg</p>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        {stats && (
          <div className="bg-slate-800 rounded-2xl p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Progress to Goal</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Progress</span>
                  <span className="text-white font-semibold">{Math.round(stats.progressToGoal)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-4 rounded-full transition-all"
                    style={{ width: `${stats.progressToGoal}%` }}
                  />
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                {stats.startWeight.toFixed(1)} kg → {stats.currentWeight.toFixed(1)} kg → {stats.goalWeight.toFixed(1)} kg
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Add Entry */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-2xl p-6 shadow-lg sticky top-4">
              <h2 className="text-2xl font-bold text-white mb-6">Log Weight</h2>

              {/* Weight Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-200 mb-2">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  placeholder="Enter weight"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Notes Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-200 mb-2">Notes (optional)</label>
                <textarea
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="How are you feeling? Any observations?"
                  rows={3}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Add Button */}
              <button
                onClick={handleAddEntry}
                disabled={!newWeight}
                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Log Weight
              </button>
            </div>
          </div>

          {/* Right Column - History */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Weight History</h2>
                <div className="flex gap-2">
                  {(['week', 'month', 'all'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-3 py-1 rounded transition-colors text-sm font-medium ${
                        selectedPeriod === period
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      }`}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {filteredEntries.length > 0 ? (
                <div className="space-y-3">
                  {filteredEntries.map((entry) => (
                    <div key={entry.id} className="bg-slate-700 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-white font-semibold text-lg">{entry.weight.toFixed(1)} kg</p>
                            <p className="text-gray-400 text-sm">{new Date(entry.date).toLocaleDateString()}</p>
                          </div>
                          {entry.notes && (
                            <div className="flex-1">
                              <p className="text-gray-300 text-sm">{entry.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No weight entries yet. Start tracking your progress!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressTracker

