module.exports = {
    success: (res, data, message) => {
      return res.status(200).json({ success: true, message, data });
    },
  
    error: (res, message, code) => {
      return res.status(code).json({ success: false, message });
    }
};