const PredictionHistory = require('../models/PredictionHistory');

exports.makePrediction = async (req, res) => {
  try {
    const { height, weight, glucose, blood_pressure, age, prediction_result } = req.body;

    const bmi = weight / (height / 100) ** 2;

    const prediction = await PredictionHistory.create({
      user_id: req.user.id,
      height,
      weight,
      bmi,
      glucose,
      blood_pressure,
      age,
      prediction_result, 
    });

    res.status(200).json({ message: 'Prediction saved successfully', prediction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await PredictionHistory.find({ user_id: req.user.id });
    res.status(200).json({ history });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
