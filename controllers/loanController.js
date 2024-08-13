const User = require("../models/User");
const Bank = require("../models/Bank");
const Loan = require("../models/Loan");
const { validationResult } = require("express-validator");

const saveBankAccount = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { user } = req;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized Request" });
    }

    const userId = user._id;
    const { bankName, accountNumber, ifscCode, accountHolderName } = req.body;

    const { status, message } = await addBankAccount(
      userId,
      bankName,
      accountNumber,
      ifscCode,
      accountHolderName
    );
    return res.status(status).json({ message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

async function addBankAccount(
  userId,
  bankName,
  accountNumber,
  ifscCode,
  accountHolderName
) {
  try {
    const newBankAccount = new Bank({
      userId,
      bankName,
      accountNumber,
      ifscCode,
      accountHolderName,
    });
    await newBankAccount.save();
    return { status: 200, message: "Bank account added" };
  } catch (error) {
    return { status: 500, message: error.message };
  }
}

const getBankAccounts = async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized Request" });
    }

    const userId = user._id;
    const bankAccounts = await Bank.find({ userId });
    return res.status(200).json({
      message: "Bank accounts fetched successfully.",
      data: bankAccounts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

const getUserLimit = async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized Request" });
    }
    const userId = user._id;
    return res.status(200).json({
      message: "Loan limits fetched",
      totalLimit: 2000,
      avaliableLimit: 2000,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

const requestLoan = async (req, res) => {
  try {
    const { user } = req;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized Request" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = user._id;
    const {
      loanAmount,
      bankAccount,
      total_repayment_amount,
      user_remarks,
      tenureDays,
    } = req.body;

    const platformFees = 50;
    const repaymentAmount = loanAmount + (loanAmount * 2) / 100;
    const servedAmount = loanAmount - platformFees;
    const { status, message } = await saveLoanRequest(
      userId,
      loanAmount,
      servedAmount,
      repaymentAmount,
      bankAccount,
      total_repayment_amount,
      tenureDays,
      user_remarks
    );
    return res.status(status).json({ message });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

async function saveLoanRequest(
  userId,
  loanAmount,
  servedAmount,
  repaymentAmount,
  bankAccount,
  total_repayment_amount,
  tenureDays,
  user_remarks
) {
  try {
    const saveRequest = new Loan({
      userId,
      loanAmount,
      servedAmount,
      repaymentAmount,
      bankAccount,
      total_repayment_amount,
      tenureDays,
      user_remarks,
    });
    await saveRequest.save();
    return { status: 200, message: "Your request has been received successfully.." };
  } catch (error) {
    return { status: 500, message: error.message };
  }
}

module.exports = {
  saveBankAccount,
  getBankAccounts,
  getUserLimit,
  requestLoan,
};
