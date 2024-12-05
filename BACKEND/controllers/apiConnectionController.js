const ApiConnection = require('../models/ApiConnection');

// Controller to add API Key and Secret Key
exports.addApiConnection = async (req, res) => {
  const { apiKey, secretKey } = req.body;

  try {
    // Check if any record already exists
    const existingConnection = await ApiConnection.findOne();
    if (existingConnection) {
      return res.status(400).json({
        message: 'API Key and Secret Key already exist.',
      });
    }

    // Create and save new record
    const newConnection = new ApiConnection({ apiKey, secretKey });
    await newConnection.save();

    res.status(201).json({
      message: 'API Key and Secret Key added successfully.',
      data: newConnection,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding API Key and Secret Key.',
      error: error.message,
    });
  }
};

// Controller to fetch API Key and Secret Key
exports.getApiConnection = async (req, res) => {
  try {
    const connection = await ApiConnection.findOne();
    if (!connection) {
      return res.status(404).json({
        message: 'No API Key and Secret Key found.',
      });
    }

    res.status(200).json({
      data: connection,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching API Key and Secret Key.',
      error: error.message,
    });
  }
};

// Controller to delete API Key and Secret Key
exports.deleteApiConnection = async (req, res) => {
  try {
    const connection = await ApiConnection.findOne();
    if (!connection) {
      return res.status(404).json({
        message: 'No API Key and Secret Key found to delete.',
      });
    }

    await ApiConnection.deleteOne({ _id: connection._id });

    res.status(200).json({
      message: 'API Key and Secret Key deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error deleting API Key and Secret Key.',
      error: error.message,
    });
  }
};
