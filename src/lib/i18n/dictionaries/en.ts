const en = {
  common: {
    appName: "HealthyLife AI",
    back: "Back",
    next: "Next",
    nextStep: "Next Step",
    loading: "Loading…",
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    errorGeneric: "Something went wrong. Please try again.",
  },
  onboarding: {
    tagline:
      "Your journey to a healthier life starts here with AI-powered personalized nutrition.",
    subtext:
      "Discover tailored wellness plans, track your progress effortlessly, and embrace a calmer, healthier you.",
    getStarted: "Get started",
    haveAccount: "Already have an account?",
    logIn: "Log In",
  },
  auth: {
    login: {
      title: "Welcome back",
      subtitle: "Log in to continue your health journey.",
      email: "Email Address",
      password: "Password",
      submit: "Log in",
      noAccount: "Don't have an account?",
      signUp: "Sign up",
      invalidCredentials: "Incorrect email or password.",
      locked:
        "Too many failed attempts. Your account is locked for 15 minutes.",
    },
    register: {
      title: "Join the journey.",
      subtitle:
        "Create your account to start receiving personalized health insights today.",
      fullName: "Full Name",
      email: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      submit: "Create account",
      haveAccount: "Already have an account?",
      logIn: "Log in",
      emailTaken: "This email is already registered.",
      passwordMismatch: "Passwords do not match.",
    },
    validation: {
      fullNameRequired: "Please enter your full name.",
      emailInvalid: "Please enter a valid email address.",
      passwordMin: "Password must be at least 8 characters.",
      passwordStrength:
        "Use at least 8 characters, including a number and an uppercase letter.",
    },
  },
  setup: {
    steps: {
      profile: "Profile",
      metrics: "Metrics",
      activity: "Activity",
      goals: "Goals",
      review: "Review",
    },
    step1: {
      title: "Welcome to HealthyLife AI",
      subtitle:
        "Let's start by getting to know you a bit better so we can tailor our insights.",
      sectionTitle: "Personal Details",
      age: "Age",
      gender: "Gender",
      genderFemale: "Female",
      genderMale: "Male",
      genderOther: "Other",
    },
    step2: {
      title: "Physical Metrics",
      subtitle:
        "Help us personalize your health insights by providing your current measurements.",
      height: "Height",
      weight: "Weight",
      cm: "cm",
      ftIn: "ft/in",
      kg: "kg",
      lbs: "lbs",
    },
    step3: {
      title: "Activity Level",
      subtitle: "Select the option that best describes your typical day.",
      sedentary: "Sedentary",
      sedentaryDesc: "Little to no exercise, desk job.",
      light: "Light",
      lightDesc: "Light exercise/sports 1-3 days/week.",
      moderate: "Moderate",
      moderateDesc: "Moderate exercise/sports 3-5 days/week.",
      active: "Active",
      activeDesc: "Hard exercise/sports 6-7 days/week.",
      veryActive: "Very Active",
      veryActiveDesc: "Very hard exercise/sports & physical job.",
    },
    step4: {
      title: "Goal",
      subtitle:
        "What's your main goal? This helps us personalize your AI health insights and recommendations.",
      lose: "Lose Weight",
      loseDesc: "Burn fat and get leaner.",
      maintain: "Maintain",
      maintainDesc: "Keep your current physique.",
      gain: "Gain Muscle",
      gainDesc: "Build strength and size.",
      finish: "Finish setup",
    },
    results: {
      title: "Your Personalized Plan",
      subtitle:
        "Based on your goals and biometric data, we've optimized your daily targets for maximum energy and sustainable progress.",
      calorieTarget: "Daily Calorie Target",
      calorieSubtitle: "Optimized for your energy needs",
      kcal: "kcal",
      protein: "Protein",
      carbs: "Carbs",
      fats: "Fats",
      ofDailyTotal: "of daily total",
      enterDashboard: "Enter Dashboard",
    },
    stepOf: "Step {current} of {total}",
  },
  weight: {
    title: "Weight Log",
    subtitle: "Track your body weight over time.",
    logWeight: "Log Weight",
    weightKg: "Weight (kg)",
    date: "Date",
    submit: "Save entry",
    empty: "No weight entries yet. Log your first one to see your trend.",
    history: "History",
  },
  dashboard: {
    title: "Dashboard",
    comingSoon: "Your nutrition dashboard is on the way (Sprint 4).",
    logout: "Log out",
  },
};

export default en;
export type Dictionary = typeof en;
