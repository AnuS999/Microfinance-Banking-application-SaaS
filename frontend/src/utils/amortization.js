export const generateAmortization = (principal, annualRate, months) => {
  const p = Number(principal);
  const r = Number(annualRate) / 12 / 100;
  const n = Number(months);

  if (!p || !r || !n) return [];

  const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  let balance = p;
  const schedule = [];

  for (let i = 1; i <= n; i++) {
    const interest = balance * r;
    const principalPaid = emi - interest;
    balance = Math.max(0, balance - principalPaid);

    schedule.push({
      installmentNo: i,
      principalPaid: Math.round(principalPaid),
      interestPaid: Math.round(interest),
      totalPayment: Math.round(emi),
      remainingBalance: Math.round(balance),
    });
  }

  return schedule;
};