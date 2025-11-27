const mongoose = require("mongoose");

const UserProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true, min: 18, max: 50 },
  monthlyIncome: { type: Number, required: true },
  monthlyExpenses: { type: Number, required: true },
  currentInvestments: { type: Number, required: true },
  riskTolerance: { 
    type: String, 
    enum: ["Conservative", "Moderate", "Aggressive"],
    required: true 
  },
  investmentGoal: { 
    type: String, 
    enum: ["Wealth Creation", "Retirement", "Home Purchase", "Other"],
    required: true 
  },
  investmentHorizon: { 
    type: String, 
    enum: ["<5 yrs", "5–10 yrs", ">10 yrs"],
    required: true 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("UserProfile", UserProfileSchema);