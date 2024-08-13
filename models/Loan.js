const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const loanSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    /* Actual loan amount for example 500 */
    loanAmount: {
      type: Number,
      required: true,
    },
    /* Amount which is served to user after taxes for example if loan is of 500 then servedAmount will be 450 */
    servedAmount: {
      type: Number,
      required: true,
    },
    /* Amount which user has to pay without any fine */
    repaymentAmount: {
      type: Number,
      required: true,
    },
    bankAccount: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    total_repayment_amount: {
      type: Number,
    },
    approval_status: {
      type: String,
      enum: ["approved", "pending", "rejected"],
      default: "pending",
      required: true,
    },
    repayment_status: {
      type: Boolean,
      required: true,
      default: false,
    },
    request_date: {
      type: Date,
      default: Date.now,
    },
    tenureDays: {
      type: String,
      required: true,
    },
    approved_date: {
      type: Date,
    },
    overdue_date: {
      type: Date,
    },
    user_remarks: {
      type: String,
    },
    admin_remarks: {
      type: String,
    },
  },
  { timestamps: true }
);
const Loan = mongoose.model("Loan", loanSchema);
module.exports = Loan;
