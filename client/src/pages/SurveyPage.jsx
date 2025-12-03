import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Loader2, User, Calendar, Wallet, PiggyBank, Shield, Target, Clock } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.coerce.number().min(18, "Age must be 18+").max(50, "Age must be ≤50"),
  monthlyIncome: z.coerce.number().min(10000, "Minimum ₹10,000").max(500000, "Maximum ₹5,00,000"),
  monthlyExpenses: z.coerce.number().min(2000).max(300000),
  currentInvestments: z.coerce.number().min(0).max(5000000),
  riskTolerance: z.enum(["Conservative", "Moderate", "Aggressive"]),
  investmentGoal: z.enum(["Wealth Creation", "Retirement", "Home Purchase", "Other"]),
  investmentHorizon: z.enum(["<5 yrs", "5–10 yrs", ">10 yrs"]),
});

export default function SurveyPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  useEffect(() => {
    const saved = localStorage.getItem("lastFormData");
    if (saved) reset(JSON.parse(saved));
  }, [reset]);

  const onSubmit = async (data) => {
    try {
      const res = await fetch("/api/profile/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Server error");

      const result = await res.json();
      localStorage.setItem("latestResult", JSON.stringify(result));
      localStorage.setItem("lastFormData", JSON.stringify(data));
      navigate("/results");
    } catch (err) {
      alert("Backend not running! Start server on port 5000");
    }
  };

  const InputField = ({ icon: Icon, label, name, type = "text", placeholder }) => (
    <div className="space-y-2">
      <label className="flex items-center gap-3 text-lg font-semibold text-gray-800">
        <Icon className="w-6 h-6 text-indigo-600" />
        {label}
      </label>
      <input
        type={type}
        {...register(name)}
        placeholder={placeholder}
        className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-lg focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
      />
      {errors[name] && <p className="text-red-500 text-sm font-medium">{errors[name].message}</p>}
    </div>
  );

  const RadioGroup = ({ icon: Icon, label, name, options }) => (
    <div className="space-y-4">
      <label className="flex items-center gap-3 text-lg font-semibold text-gray-800">
        <Icon className="w-6 h-6 text-indigo-600" />
        {label}
      </label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center justify-center px-6 py-5 bg-gray-50 rounded-2xl border-2 border-gray-200 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all has-[:checked]:bg-indigo-600 has-[:checked]:text-white has-[:checked]:border-indigo-600"
          >
            <input
              type="radio"
              value={opt}
              {...register(name)}
              className="sr-only"
            />
            <span className="font-medium text-lg">{opt}</span>
          </label>
        ))}
      </div>
      {errors[name] && <p className="text-red-500 text-sm font-medium">{errors[name].message}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Let's Build Your Wealth Plan
          </h1>
          <p className="text-xl text-gray-600">Answer a few questions. Get a personalized investment strategy in seconds.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-10 md:p-14 space-y-12">
          
          <div className="grid md:grid-cols-2 gap-8">
            <InputField icon={User} label="Full Name" name="name" placeholder="John Doe" />
            <InputField icon={Calendar} label="Your Age" name="age" type="number" placeholder="30" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <InputField icon={Wallet} label="Monthly Income (₹)" name="monthlyIncome" type="number" placeholder="75,000" />
            <InputField icon={Wallet} label="Monthly Expenses (₹)" name="monthlyExpenses" type="number" placeholder="40,000" />
            <InputField icon={PiggyBank} label="Current Investments (₹)" name="currentInvestments" type="number" placeholder="5,00,000" />
          </div>
          <div className="space-y-12">
            <RadioGroup
              icon={Shield}
              label="Risk Tolerance"
              name="riskTolerance"
              options={["Conservative", "Moderate", "Aggressive"]}
            />

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="flex items-center gap-3 text-lg font-semibold text-gray-800">
                  <Target className="w-6 h-6 text-indigo-600" />
                  Investment Goal
                </label>
                <select
                  {...register("investmentGoal")}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-lg focus:outline-none focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
                >
                  <option>Wealth Creation</option>
                  <option>Retirement</option>
                  <option>Home Purchase</option>
                  <option>Other</option>
                </select>
              </div>

              <RadioGroup
                icon={Clock}
                label="Investment Horizon"
                name="investmentHorizon"
                options={["<5 yrs", "5–10 yrs", ">10 yrs"]}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-2xl py-6 rounded-3xl shadow-2xl hover:shadow-indigo-600/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={32} />
                Building Your Plan...
              </>
            ) : (
              <>
                Generate My Plan
              </>
            )}
          </button>

          <p className="text-center text-gray-500 text-sm mt-8">
            Your data is secure • No spam • Takes less than 60 seconds
          </p>
        </form>
      </div>
    </div>
  );
}