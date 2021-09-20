const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const counterSchema = new Schema(
	{
		name: { type: String, required: true },
		todayCount: {
			firstDosage: "Number",
			secondDosage: "Number",
			fails: "Number",
			total: "Number"
		},
		totalCount: { type: Number, required: true },
	},
	{ timestamps: true }
);

const Counter = mongoose.model("Counter", counterSchema);

module.exports = {
	Counter,
};
