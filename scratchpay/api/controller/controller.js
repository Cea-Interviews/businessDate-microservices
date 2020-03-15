const { calculate, generateCalendar } = require("../../utils/calculator");

const businessDate = async (req, res) => {
  const { initialDate, delay, country } = req.body;
  try {
    const data = calculate(initialDate, delay, country);
    if (!data.error) {
      return res.status(200).json({
        ok: true,
        ...data,
      });
    }
    console.log(data.error)
    return res.status(404).json({
      ok: false,
      message: data.error,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: 'Something went wrong',
    });
  }
};

module.exports = { businessDate };
