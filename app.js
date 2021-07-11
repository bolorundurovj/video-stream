const express = require('express');
const app = express();
const fs = require('fs');
const PORT = 3000;
const port = process.env.PORT || PORT;
const www = process.env.WWW || './';


app.use(express.static(www));
console.log(`serving ${www}`);
app.get('/', (req, res) => {
    res.sendFile(`index.html`, {
        root: www
    });
});

app.get('/video', (req, res) => {
    const range = req.headers.range;
    if (!range) {
        res.status(400).send('Requires range header')
    } else {
        const videoPath = 'houseruns.mp4';
        const videoSize = fs.statSync('houseruns.mp4').size;
        const CHUNK_SIZE = 10 ** 6; //1MB
        const start = Number(range.replace(/\D/g, ''));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
        const contentLength = end - start + 1;
        const headers = {
            'Content-Range': `bytes ${start}-${end}/${videoSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': contentLength,
            'Content-Type': 'video/mp4',
        }

        res.writeHead(206, headers);
        const videoStream = fs.createReadStream(videoPath, {
            start,
            end
        });
        videoStream.pipe(res)
    }
})

app.listen(port, () => console.log(`listening on http://localhost:${port}`));