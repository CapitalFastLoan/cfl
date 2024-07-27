const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BankSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true,
      minlength: 9,
    },
    accountHolderName: {
      type: String,
      required: true,
    },
    ifscCode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook to enforce the two accounts limit per user
BankSchema.pre("save", async function (next) {
  const bank = this;
  const count = await mongoose.model("Bank").countDocuments({ userId: bank.userId });

  if (count >= 2) {
    const error = new Error("User cannot have more than two bank accounts");
    next(error);
  } else {
    next();
  }
});

const Bank = mongoose.model("Bank", BankSchema);
module.exports = Bank;
