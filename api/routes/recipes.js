const router = require('express').Router();
const db = require('../db/recipes');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;
const { ensureAuthenticated } = require('../auth');

async function writeBase64ToFile(base64String) {
    const commaIndex = base64String.indexOf(',');
    const base64Data = base64String.substring(commaIndex + 1);
    const buffer = Buffer.from(base64Data, 'base64');
    const fileName = `${uuidv4()}.jpg`;
    const filePath = path.join('public', fileName);
    await fs.writeFile(filePath, buffer);
    return fileName;
}


router.post('/add', ensureAuthenticated, async (req, res) => {
    const { id } = req.user;
    const { imageBase64 } = req.body;
    const fileName = await writeBase64ToFile(imageBase64);
    await db.add(req.body, fileName, id);
    res.json({ status: "ok" });
});

router.get('/getallpublic', async (req, res) => {
    res.json(await db.getAllPublic());
});

router.get('/image/:imagename', (req, res) => {
    const filename = req.params.imagename;
    const filePath = path.join(__dirname, '../public', filename);
    res.sendFile(filePath);
});

module.exports = router;