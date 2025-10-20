import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { foodDatabase, searchFoods, calculateNutrition, Food } from '../lib/foodDatabase'

interface LoggedFood {
  id: string
  food: Food
  servings: number
  timestamp: string
}

interface DailyLog {
  date: string
  foods: LoggedFood[]
  totals: {
    calories: number
    protein: number
    carbs: number
    fats: number
  }
}

const FoodDiary: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Food[]>([])
  const [showSearch, setShowSearch] = useState(false)
  const [selectedServings, setSelectedServings] = useState(1)
  const [targets, setTargets] = useState({ calories: 2000, protein: 150, carbs: 200, fats: 65 })
  const [loading, setLoading] = useState(true)

  // Fetch targets from user profile
  useEffect(() => {
    const fetchTargets = async () => {
      if (!user) return

      try {
        const { data } = await supabase
          .from('onboarding_data')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)

        if (data && data.length > 0) {
          // These would come from nutrition plan calculation
          setTargets({
            calories: 2000, // Should be fetched from nutrition plan
            protein: 150,
            carbs: 200,
            fats: 65,
          })
        }
        setLoading(false)
      } catch (err) {
        console.error('Error fetching targets:', err)
        setLoading(false)
      }
    }

    fetchTargets()
  }, [user])

  // Load daily log from localStorage (in a real app, this would be from Supabase)
  useEffect(() => {
    const storedLog = localStorage.getItem(`food_diary_${selectedDate}`)
    if (storedLog) {
      setDailyLog(JSON.parse(storedLog))
    } else {
      setDailyLog({
        date: selectedDate,
        foods: [],
        totals: { calories: 0, protein: 0, carbs: 0, fats: 0 },
      })
    }
  }, [selectedDate])

  // Handle food search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setSearchResults(searchFoods(query))
    } else {
      setSearchResults([])
    }
  }

  // Add food to daily log
  const addFoodToLog = (food: Food) => {
    if (!dailyLog) return

    const nutrition = calculateNutrition(food, selectedServings)
    const newFood: LoggedFood = {
      id: `${food.id}_${Date.now()}`,
      food,
      servings: selectedServings,
      timestamp: new Date().toISOString(),
    }

    const updatedFoods = [...dailyLog.foods, newFood]
    const newTotals = {
      calories: dailyLog.totals.calories + nutrition.calories,
      protein: dailyLog.totals.protein + nutrition.protein,
      carbs: dailyLog.totals.carbs + nutrition.carbs,
      fats: dailyLog.totals.fats + nutrition.fats,
    }

    const updatedLog = { ...dailyLog, foods: updatedFoods, totals: newTotals }
    setDailyLog(updatedLog)
    localStorage.setItem(`food_diary_${selectedDate}`, JSON.stringify(updatedLog))

    // Reset search
    setSearchQuery('')
    setSearchResults([])
    setShowSearch(false)
    setSelectedServings(1)
  }

  // Remove food from log
  const removeFoodFromLog = (id: string) => {
    if (!dailyLog) return

    const foodToRemove = dailyLog.foods.find((f) => f.id === id)
    if (!foodToRemove) return

    const nutrition = calculateNutrition(foodToRemove.food, foodToRemove.servings)
    const updatedFoods = dailyLog.foods.filter((f) => f.id !== id)
    const newTotals = {
      calories: Math.max(0, dailyLog.totals.calories - nutrition.calories),
      protein: Math.max(0, dailyLog.totals.protein - nutrition.protein),
      carbs: Math.max(0, dailyLog.totals.carbs - nutrition.carbs),
      fats: Math.max(0, dailyLog.totals.fats - nutrition.fats),
    }

    const updatedLog = { ...dailyLog, foods: updatedFoods, totals: newTotals }
    setDailyLog(updatedLog)
    localStorage.setItem(`food_diary_${selectedDate}`, JSON.stringify(updatedLog))
  }

  // Calculate remaining macros
  const remaining = {
    calories: Math.max(0, targets.calories - (dailyLog?.totals.calories || 0)),
    protein: Math.max(0, targets.protein - (dailyLog?.totals.protein || 0)),
    carbs: Math.max(0, targets.carbs - (dailyLog?.totals.carbs || 0)),
    fats: Math.max(0, targets.fats - (dailyLog?.totals.fats || 0)),
  }

  // Calculate percentages
  const percentages = {
    calories: Math.round(((dailyLog?.totals.calories || 0) / targets.calories) * 100),
    protein: Math.round(((dailyLog?.totals.protein || 0) / targets.protein) * 100),
    carbs: Math.round(((dailyLog?.totals.carbs || 0) / targets.carbs) * 100),
    fats: Math.round(((dailyLog?.totals.fats || 0) / targets.fats) * 100),
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-white">Loading food diary...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">Food Diary</h1>
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
        {/* Date Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-200 mb-2">Select Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Daily Totals */}
          <div className="lg:col-span-2">
            {/* Daily Summary */}
            <div className="bg-slate-800 rounded-2xl p-6 shadow-lg mb-8">
              <h2 className="text-2xl font-bold text-white mb-6">Daily Summary</h2>

              {/* Macro Cards */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Calories */}
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-2">Calories</p>
                  <p className="text-3xl font-bold text-blue-400 mb-2">{dailyLog?.totals.calories || 0}</p>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(percentages.calories, 100)}%` }}
                    />
                  </div>
                  <p className="text-gray-400 text-xs mt-2">
                    {remaining.calories} remaining / {targets.calories} target
                  </p>
                </div>

                {/* Protein */}
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-2">Protein</p>
                  <p className="text-3xl font-bold text-green-400 mb-2">{dailyLog?.totals.protein.toFixed(1) || 0}g</p>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(percentages.protein, 100)}%` }}
                    />
                  </div>
                  <p className="text-gray-400 text-xs mt-2">
                    {remaining.protein.toFixed(1)}g remaining / {targets.protein}g target
                  </p>
                </div>

                {/* Carbs */}
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-2">Carbs</p>
                  <p className="text-3xl font-bold text-orange-400 mb-2">{dailyLog?.totals.carbs.toFixed(1) || 0}g</p>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(percentages.carbs, 100)}%` }}
                    />
                  </div>
                  <p className="text-gray-400 text-xs mt-2">
                    {remaining.carbs.toFixed(1)}g remaining / {targets.carbs}g target
                  </p>
                </div>

                {/* Fats */}
                <div className="bg-slate-700 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-2">Fats</p>
                  <p className="text-3xl font-bold text-yellow-400 mb-2">{dailyLog?.totals.fats.toFixed(1) || 0}g</p>
                  <div className="w-full bg-slate-600 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(percentages.fats, 100)}%` }}
                    />
                  </div>
                  <p className="text-gray-400 text-xs mt-2">
                    {remaining.fats.toFixed(1)}g remaining / {targets.fats}g target
                  </p>
                </div>
              </div>
            </div>

            {/* Logged Foods */}
            <div className="bg-slate-800 rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-6">Logged Foods</h2>

              {dailyLog && dailyLog.foods.length > 0 ? (
                <div className="space-y-3">
                  {dailyLog.foods.map((loggedFood) => {
                    const nutrition = calculateNutrition(loggedFood.food, loggedFood.servings)
                    return (
                      <div key={loggedFood.id} className="bg-slate-700 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-white font-semibold">
                            {loggedFood.food.name} × {loggedFood.servings} {loggedFood.food.servingUnit}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {nutrition.calories} cal | P: {nutrition.protein.toFixed(1)}g | C: {nutrition.carbs.toFixed(1)}g | F: {nutrition.fats.toFixed(1)}g
                          </p>
                        </div>
                        <button
                          onClick={() => removeFoodFromLog(loggedFood.id)}
                          className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No foods logged yet. Add a food to get started!</p>
              )}
            </div>
          </div>

          {/* Right Column - Add Food */}
          <div>
            <div className="bg-slate-800 rounded-2xl p-6 shadow-lg sticky top-4">
              <h2 className="text-2xl font-bold text-white mb-6">Add Food</h2>

              {/* Search Input */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search foods..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => setShowSearch(true)}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Search Results */}
              {showSearch && searchResults.length > 0 && (
                <div className="mb-4 max-h-64 overflow-y-auto bg-slate-700 rounded-lg">
                  {searchResults.map((food) => (
                    <button
                      key={food.id}
                      onClick={() => {
                        setSearchQuery('')
                        setSearchResults([])
                        setShowSearch(false)
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-600 transition-colors border-b border-slate-600 last:border-b-0"
                    >
                      <p className="text-white font-medium">{food.name}</p>
                      <p className="text-gray-400 text-xs">{food.servingSize} {food.servingUnit}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* Servings Input */}
              {searchQuery && searchResults.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-200 mb-2">Servings</label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    value={selectedServings}
                    onChange={(e) => setSelectedServings(parseFloat(e.target.value))}
                    className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* Add Button */}
              {searchQuery && searchResults.length > 0 && (
                <button
                  onClick={() => {
                    const selectedFood = searchResults[0]
                    addFoodToLog(selectedFood)
                  }}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Add Food
                </button>
              )}

              {/* Quick Add Buttons */}
              <div className="mt-6 pt-6 border-t border-slate-700">
                <p className="text-sm font-medium text-gray-200 mb-3">Quick Add</p>
                <div className="space-y-2">
                  {foodDatabase.slice(0, 5).map((food) => (
                    <button
                      key={food.id}
                      onClick={() => addFoodToLog(food)}
                      className="w-full text-left px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors text-sm"
                    >
                      {food.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FoodDiary

