const router = require('express').Router();
const db = require('../db/categories');

router.post('/add', async (req, res) => {
    const { id } = req.user;
    await db.add({ name: req.body.name, userId: id });
    res.json({ status: "ok" });
});

router.get('/getall', async (req, res) => {
    const { id } = req.user;
    res.json(await db.getAll(id));
});

module.exports = router;