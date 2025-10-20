import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { OnboardingProvider } from './context/OnboardingContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Auth Pages
import Login from './pages/Login'
import Signup from './pages/Signup'

// Onboarding Pages
import Welcome from './pages/onboarding/Welcome'
import PersonalInfo from './pages/onboarding/PersonalInfo'
import ActivityLevel from './pages/onboarding/ActivityLevel'
import FitnessGoals from './pages/onboarding/FitnessGoals'
import TrainingPreferences from './pages/onboarding/TrainingPreferences'
import MuscleGroups from './pages/onboarding/MuscleGroups'
import DietaryRestrictions from './pages/onboarding/DietaryRestrictions'
import ProgressScale from './pages/onboarding/ProgressScale'
import Summary from './pages/onboarding/Summary'

// Main App Pages
import Dashboard from './pages/Dashboard'
import NutritionPlan from './pages/NutritionPlan'

function App() {
  return (
    <AuthProvider>
      <OnboardingProvider>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Onboarding Routes (Protected) */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Welcome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/personal-info"
              element={
                <ProtectedRoute>
                  <PersonalInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/activity-level"
              element={
                <ProtectedRoute>
                  <ActivityLevel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/fitness-goals"
              element={
                <ProtectedRoute>
                  <FitnessGoals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/training-preferences"
              element={
                <ProtectedRoute>
                  <TrainingPreferences />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/muscle-groups"
              element={
                <ProtectedRoute>
                  <MuscleGroups />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/dietary-restrictions"
              element={
                <ProtectedRoute>
                  <DietaryRestrictions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/progress-scale"
              element={
                <ProtectedRoute>
                  <ProgressScale />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding/summary"
              element={
                <ProtectedRoute>
                  <Summary />
                </ProtectedRoute>
              }
            />

            {/* Main App Routes (Protected) */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/nutrition-plan"
              element={
                <ProtectedRoute>
                  <NutritionPlan />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </OnboardingProvider>
    </AuthProvider>
  )
}

export default App

