import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ActivityLevel, Gender, Goal } from "@/lib/api/profile";

type HeightUnit = "cm" | "ft_in";
type WeightUnit = "kg" | "lb";

type SetupState = {
  age: number | null;
  gender: Gender | null;
  heightUnit: HeightUnit;
  heightCm: number | null;
  heightFt: number | null;
  heightIn: number | null;
  weightUnit: WeightUnit;
  weightKg: number | null;
  weightLb: number | null;
  activityLevel: ActivityLevel | null;
  goal: Goal | null;
  setStep1: (data: { age: number; gender: Gender }) => void;
  setStep2: (
    data: Partial<
      Pick<
        SetupState,
        | "heightUnit"
        | "heightCm"
        | "heightFt"
        | "heightIn"
        | "weightUnit"
        | "weightKg"
        | "weightLb"
      >
    >,
  ) => void;
  setActivityLevel: (activityLevel: ActivityLevel) => void;
  setGoal: (goal: Goal) => void;
  reset: () => void;
};

const initialState = {
  age: null,
  gender: null,
  heightUnit: "cm" as HeightUnit,
  heightCm: null,
  heightFt: null,
  heightIn: null,
  weightUnit: "kg" as WeightUnit,
  weightKg: null,
  weightLb: null,
  activityLevel: null,
  goal: null,
};

export const useSetupStore = create<SetupState>()(
  persist(
    (set) => ({
      ...initialState,
      setStep1: (data) => set(data),
      setStep2: (data) => set(data),
      setActivityLevel: (activityLevel) => set({ activityLevel }),
      setGoal: (goal) => set({ goal }),
      reset: () => set(initialState),
    }),
    { name: "healthylife.setup" },
  ),
);
