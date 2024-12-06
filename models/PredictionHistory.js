const mongoose = require('mongoose');

const predictionHistorySchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  bmi: { type: Number, required: true },
  glucose: { type: Number, required: true },
  blood_pressure: { type: Number, required: true },
  age: { type: Number, required: true },
  prediction_result: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('PredictionHistory', predictionHistorySchema);
