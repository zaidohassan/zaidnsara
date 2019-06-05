module.exports = {
  getPics: (req, res) => {
    const db = req.app.get('db');
    db.getPics().then(response => {
      res.status(200).json(response);
    });
  }
};
