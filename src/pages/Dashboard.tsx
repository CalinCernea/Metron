import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  UserCircleIcon,
  ChartBarSquareIcon,
  BoltIcon,
  DumbbellIcon,
  UtensilsIcon,
  ScaleIcon,
  CreditCardIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/solid'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const quickStats = [
    {
      label: 'Profile Status',
      value: 'Complete',
      icon: UserCircleIcon,
      color: 'text-green-400',
    },
    {
      label: 'Nutrition Plan',
      value: 'Ready',
      icon: UtensilsIcon,
      color: 'text-blue-400',
      link: '/nutrition-plan',
    },
    {
      label: 'Workout Plan',
      value: 'Generated',
      icon: DumbbellIcon,
      color: 'text-orange-400',
      link: '/workout-plan',
    },
    {
      label: 'Subscription',
      value: 'Premium Trial', // Placeholder
      icon: CreditCardIcon,
      color: 'text-purple-400',
      link: '/subscription',
    },
  ]

  const featureCards = [
    {
      title: 'Nutrition Plan',
      description: 'View your personalized macronutrient breakdown and daily caloric targets.',
      icon: UtensilsIcon,
      color: 'from-blue-600 to-blue-700',
      link: '/nutrition-plan',
    },
    {
      title: 'Workout Plan',
      description: 'Check your adaptive training program, schedule, and exercise details.',
      icon: DumbbellIcon,
      color: 'from-orange-600 to-orange-700',
      link: '/workout-plan',
    },
    {
      title: 'Food Diary',
      description: 'Log your meals and track your daily intake against your targets.',
      icon: ScaleIcon,
      color: 'from-green-600 to-green-700',
      link: '/food-diary',
    },
    {
      title: 'Progress Tracker',
      description: 'Monitor your weight, measurements, and visualize your journey.',
      icon: ChartBarSquareIcon,
      color: 'from-purple-600 to-purple-700',
      link: '/progress-tracker',
    },
  ]

  const FeatureCard: React.FC<{ title: string; description: string; icon: React.ElementType; color: string; link: string }> = ({ title, description, icon: Icon, color, link }) => (
    <div
      className={`bg-gradient-to-br ${color} rounded-2xl p-8 shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer`}
      onClick={() => navigate(link)}
    >
      <div className="flex items-start justify-between mb-4">
        <Icon className="h-10 w-10 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-white/80 text-sm">{description}</p>
      <button className="mt-4 text-white font-semibold flex items-center gap-2 hover:text-white/90 transition-colors">
        Go to {title}
        <ArrowRightOnRectangleIcon className="h-4 w-4" />
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header/Nav */}
      <div className="bg-gray-800 border-b border-gray-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <BoltIcon className="h-6 w-6 text-blue-500" />
            Metron Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-300 text-sm hidden sm:block">
              Welcome, <span className="font-semibold text-white">{user?.email?.split('@')[0]}</span>
            </span>
            <button
              onClick={() => navigate('/pricing')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors text-sm"
            >
              Upgrade
            </button>
            <button
              onClick={handleLogout}
              className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-6">Your Progress Snapshot</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {quickStats.map((stat) => {
              const IconComponent = stat.icon
              return (
                <div key={stat.label} className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700/50">
                  <div className="flex items-center gap-3 mb-2">
                    <IconComponent className={`h-6 w-6 ${stat.color}`} />
                    <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                  </div>
                  <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Main Features Grid */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-6">Core Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featureCards.map((card) => (
              <FeatureCard key={card.title} {...card} />
            ))}
          </div>
        </div>
        
        {/* Secondary Links/Management */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-white mb-6">Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard title="Pricing & Upgrade" description="View plans, manage your subscription, or start your free trial." icon={CreditCardIcon} color="from-purple-800 to-purple-900" link="/pricing" />
            <FeatureCard title="Account Settings" description="Update your personal information and preferences." icon={UserCircleIcon} color="from-gray-700 to-gray-800" link="/profile" />
            <FeatureCard title="Help & Support" description="Get answers to your questions and contact our support team." icon={BoltIcon} color="from-red-700 to-red-800" link="/support" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

