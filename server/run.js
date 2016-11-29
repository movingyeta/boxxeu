const express = require('express')
const aws = require('aws-sdk')

const app = express()
app.set('views', './static/html')
app.use(express.static('./static'))
app.listen(process.env.PORT || 3000)

const S3_BUCKET = process.env.S3_BUCKET

app.get('/files', (req, res) => res.render('files.html'))
app.get('/files/upload', (req, res) => res.render('files-upload.html'))

/*
 * Upon request, return JSON containing the temporarily-signed S3 request and
 * the anticipated URL of the image.
 */
app.get('/sign-s3', (req, res) => {
    const s3 = new aws.S3()
    const fileName = req.query['file-name']
    const fileType = req.query['file-type']
    const s3Params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
    }

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
            console.log(err)
            return res.end()
        }
        const returnData = {
            signedRequest: data,
            url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
        }
        res.write(JSON.stringify(returnData))
        res.end()
    })
})

/*
 * Respond to POST requests to /submit_form.
 * This function needs to be completed to handle the information in
 * a way that suits your application.
 */
app.post('/save-details', (req, res) => {
    // TODO: Read POSTed form data and do something useful
})