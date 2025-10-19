import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { OnboardingProvider } from './context/OnboardingContext'
import Welcome from './pages/onboarding/Welcome'
import PersonalInfo from './pages/onboarding/PersonalInfo'
import ActivityLevel from './pages/onboarding/ActivityLevel'
import FitnessGoals from './pages/onboarding/FitnessGoals'
import TrainingPreferences from './pages/onboarding/TrainingPreferences'
import MuscleGroups from './pages/onboarding/MuscleGroups'
import DietaryRestrictions from './pages/onboarding/DietaryRestrictions'
import ProgressScale from './pages/onboarding/ProgressScale'
import Summary from './pages/onboarding/Summary'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <OnboardingProvider>
      <Router>
        <Routes>
          {/* Onboarding Routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/onboarding/personal-info" element={<PersonalInfo />} />
          <Route path="/onboarding/activity-level" element={<ActivityLevel />} />
          <Route path="/onboarding/fitness-goals" element={<FitnessGoals />} />
          <Route path="/onboarding/training-preferences" element={<TrainingPreferences />} />
          <Route path="/onboarding/muscle-groups" element={<MuscleGroups />} />
          <Route path="/onboarding/dietary-restrictions" element={<DietaryRestrictions />} />
          <Route path="/onboarding/progress-scale" element={<ProgressScale />} />
          <Route path="/onboarding/summary" element={<Summary />} />

          {/* Main App Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </OnboardingProvider>
  )
}

export default App

