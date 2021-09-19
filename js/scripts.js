"use strict";

// TODO: connect constants to CMS
const INTEREST_RATE = 0.025;
const RISK_INDICATOR = 0.56;
const CREDITWORTHINESS_DEVIATION = 0.1;

function getMonthlyCostsByFamilyMembersNumber(numberOfFamilyMembers) {
  if (!Number.isInteger(numberOfFamilyMembers) || numberOfFamilyMembers < 1) {
    return 0;
  }

  switch (numberOfFamilyMembers) {
    case 1:
      return 600;
    case 2:
      return 1000;
    case 3:
      return 1550;
    case 4:
      return 1960;
    case 5:
      return 2520;
    case 6:
      return 3020;
    case 7:
      return 3520;
    case 8:
      return 4020;
    case 9:
      return 4520;
    case 10:
      return 5020;
    default:
      return 5020 + (numberOfFamilyMembers - 10) * 500;
  }
}

function formatMoneyValue(value, numberOfDecimalPlaces = 2) {
  return value.toFixed(numberOfDecimalPlaces).replace(/[.,]00$/, "");
}

function calculateLoanAmount(investmentValue, contribution) {
  return investmentValue - contribution;
}

function calculateNumberOfRates(repaymentPeriodInYears) {
  return repaymentPeriodInYears * 12;
}

function calculateMonthlyRate(loanAmount, numberOfRates, interestRate) {
  return (
    (loanAmount * (interestRate / 12)) /
    (1 - (1 + interestRate / 12) ** -numberOfRates)
  );
}

function calculateCapitalRatio(creditDurationInYears) {
  const numberOfRates = creditDurationInYears * 12;
  return (
    100000 /
    (calculateMonthlyRate(100000, numberOfRates, INTEREST_RATE) * numberOfRates)
  );
}

function loanCalculatorFormSubmitCallback(event) {
  event.preventDefault();
  event.stopPropagation();

  const investmentValue = parseFloat(event.target.investmentValue.value || 0);
  const contribution = parseFloat(event.target.contribution.value || 0);
  const repaymentPeriod = parseFloat(event.target.repaymentPeriod.value || 0);

  const loanAmountValue = calculateLoanAmount(investmentValue, contribution);
  const numberOfRatesValue = calculateNumberOfRates(repaymentPeriod);

  const monthlyRateValue = calculateMonthlyRate(
    loanAmountValue,
    numberOfRatesValue,
    INTEREST_RATE
  );

  const loanAmountInput = document.getElementById("loanAmount");
  loanAmountInput.value = formatMoneyValue(loanAmountValue);
  const numberOfRatesInput = document.getElementById("numberOfRates");
  numberOfRatesInput.value = numberOfRatesValue;
  const monthlyRateInput = document.getElementById("monthlyRate");
  monthlyRateInput.value = formatMoneyValue(monthlyRateValue);
}

function loanComparisonCalculatorFormSubmitCallback(event) {
  event.stopPropagation();
  event.preventDefault();

  for (let i = 1; i <= 3; i++) {
    const investmentValue = parseFloat(
      event.target["investmentValue" + i].value || 0
    );
    const contribution = parseFloat(
      event.target["contribution" + i].value || 0
    );
    const repaymentPeriod = parseFloat(
      event.target["repaymentPeriod" + i].value || 0
    );

    const loanAmountValue = calculateLoanAmount(investmentValue, contribution);
    const numberOfRatesValue = calculateNumberOfRates(repaymentPeriod);

    const monthlyRateValue = calculateMonthlyRate(
      loanAmountValue,
      numberOfRatesValue,
      INTEREST_RATE
    );

    const loanAmountInput = document.getElementById("loanAmount" + i);
    loanAmountInput.value = formatMoneyValue(loanAmountValue);
    const numberOfRatesInput = document.getElementById("numberOfRates" + i);
    numberOfRatesInput.value = numberOfRatesValue;
    const monthlyRateInput = document.getElementById("monthlyRate" + i);
    monthlyRateInput.value = formatMoneyValue(monthlyRateValue);
  }
}

function creditworthinessCalculatorFormSubmitCallback(event) {
  event.preventDefault();
  event.stopPropagation();

  const yearOfBirthValue = parseInt(event.target.yearOfBirth.value || 0);
  const netIncomeValue = parseFloat(event.target.netIncome.value || 0);
  const numberOfFamilyMembersValue = parseFloat(
    event.target.numberOfFamilyMembers.value || 0
  );

  const creditRatesSumValue = parseFloat(
    event.target.creditRatesSum.value || 0
  );
  const creditCardsLimitsSumValue = parseFloat(
    event.target.creditCardsLimitsSum.value || 0
  );
  const alimonyValue = parseFloat(event.target.alimony.value || 0);
  const otherChargesValue = parseFloat(event.target.otherCharges.value || 0);

  const age = new Date().getFullYear() - yearOfBirthValue;
  const income =
    (netIncomeValue -
      getMonthlyCostsByFamilyMembersNumber(numberOfFamilyMembersValue) -
      creditRatesSumValue -
      creditCardsLimitsSumValue -
      alimonyValue -
      otherChargesValue) *
    RISK_INDICATOR;

  const maxCreditDurationForCalculation = 65 - age > 25 ? 25 : 65 - age;
  const capitalRatio = calculateCapitalRatio(maxCreditDurationForCalculation);

  const creditWorthiness =
    income * 12 * maxCreditDurationForCalculation * capitalRatio;

  const minCreditworthinessInput = document.getElementById(
    "minCreditworthiness"
  );
  minCreditworthinessInput.value = formatMoneyValue(
    creditWorthiness * (1 - CREDITWORTHINESS_DEVIATION),
    0
  );

  const maxCreditworthinessInput = document.getElementById(
    "maxCreditworthiness"
  );
  maxCreditworthinessInput.value = formatMoneyValue(
    creditWorthiness * (1 + CREDITWORTHINESS_DEVIATION),
    0
  );

  const maxCreditDurationInput = document.getElementById("maxCreditDuration");
  maxCreditDurationInput.value = 65 - age;
}

window.onload = function () {
  const loanCalculatorForm = document.getElementById("loan-calculator-form");
  if (loanCalculatorForm)
    loanCalculatorForm.addEventListener(
      "submit",
      loanCalculatorFormSubmitCallback
    );

  const loanComparisonCalculatorForm = document.getElementById(
    "loan-comparison-calculator-form"
  );
  if (loanComparisonCalculatorForm)
    loanComparisonCalculatorForm.addEventListener(
      "submit",
      loanComparisonCalculatorFormSubmitCallback
    );

  const creditworthinessForm = document.getElementById(
    "creditworthiness-calculator-form"
  );
  if (creditworthinessForm)
    creditworthinessForm.addEventListener(
      "submit",
      creditworthinessCalculatorFormSubmitCallback
    );
};
