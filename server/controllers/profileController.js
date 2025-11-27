const UserProfile = require("../models/userProfile");

const calculateAssetAllocation = (age, risk, horizon) => {
  let equity = 50;
  let debt = 30;
  let gold = 10;
  let realEstate = 10;

  if (risk === "Aggressive") equity += 30;
  if (risk === "Moderate") equity += 15;
  if (risk === "Conservative") equity -= 20;

  equity -= (age - 25) * 0.7;
  debt += (age - 25) * 0.6;

  if (horizon === "<5 yrs") {
    equity = Math.max(20, equity - 25);
    debt += 20;
  }
  if (horizon === ">10 yrs") {
    equity += 15;
    debt -= 10;
  }
  equity = Math.max(15, Math.min(90, Math.round(equity)));
  debt = Math.max(5, Math.min(70, Math.round(debt)));
  gold = 10;
  realEstate = 100 - equity - debt - gold;

  return { equity, debt, gold, realEstate };
};
const calculateHealthScore = (income, expenses, investments) => {
  const savingsRate = ((income - expenses) / income) * 100;
  const investmentRatio = investments / (income * 12);
  const baseScore = 300;
  const savingsBonus = savingsRate * 10;
  const investmentBonus = investmentRatio * 300;
  return Math.min(1000, Math.round(baseScore + savingsBonus + investmentBonus + Math.random() * 50));
};

exports.submitProfile = async (req, res) => {
  try {

    const { age, riskTolerance, investmentHorizon, monthlyIncome, monthlyExpenses, currentInvestments } = req.body;
    const profile = new UserProfile(req.body);
    console.log("Saving profile:", profile);
    await profile.save();

    const allocation = calculateAssetAllocation(age, riskTolerance, investmentHorizon);
    const healthScore = calculateHealthScore(monthlyIncome, monthlyExpenses, currentInvestments);
    const monthlySurplus = monthlyIncome - monthlyExpenses;
    const recommendedSIP = Math.round(monthlySurplus * 0.5);

    const sipBreakdown = {
      equity: Math.round(recommendedSIP * allocation.equity / 100),
      debt: Math.round(recommendedSIP * allocation.debt / 100),
      gold: Math.round(recommendedSIP * allocation.gold / 100),
      realEstate: Math.round(recommendedSIP * allocation.realEstate / 100),
    };

    const response = {
      ...profile.toObject(),
      healthScore,
      allocation,
      recommendedSIP,
      sipBreakdown,
      emergencyFundMonths: Math.round((currentInvestments / monthlyExpenses) || 0),
      recommendedInsurance: monthlyIncome * 12 * 10, 
      projectedCorpus: Math.round(recommendedSIP * 12 * 15 * 13), 
    };

    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getLatestProfile = async (req, res) => {
  try {
    const latest = await UserProfile.findOne().sort({ createdAt: -1 });
    res.json(latest || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
