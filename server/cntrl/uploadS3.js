require('dotenv').config();
const aws = require('aws-sdk');
const s3Bucket = new aws.S3({
  Bucket: process.env.BUCKET,
  accessKeyId: process.env.S3_Access_Key_ID,
  secretAccessKey: process.env.S3_Secret_Access_Key
});
module.exports = {
  uploadPic: async (req, res) => {
    const db = req.app.get('db');
    try {
      const params = [
        {
          Bucket: process.env.BUCKET,
          Key: req.file.originalname,
          Body: req.file.buffer,
          ContentType: req.file.mimetype
        },
        {
          Bucket: process.env.BUCKET,
          MaxKeys: 2
        }
      ];

      let checkArr;
      db.getPics().then(response => {
        checkArr = response;
      });

      await s3Bucket.listObjects(params[1], function(err, data) {
        if (err) console.log(err, err.stack);
        else {
          let filter = checkArr.filter((c, i) => {
            let filter2 = data.Contents.filter((d, i) => {
              if (c.keys && d.Key === req.file.originalname) {
                console.log('ok it matched');
                res.status(500).json('it matched');
                return true;
              }
            });
          });

          s3Bucket.upload(params[0], (err, data) => {
            if (err) {
              console.log('Error in callback', err);
            }

            db.uploadpic([data.Location, data.key]).then(response => {
              res.status(200).json(response);
            });
          });
        }
      });
    } catch (err) {
      res.status(500).json('Internal server error');
    }
  },
  deletePic: (req, res) => {
    const params = {
      Bucket: process.env.BUCKET,
      Key: req.body.keys
    };

    s3Bucket.deleteObject(params, function(err, data) {
      const db = req.app.get('db');
      if (err) console.log(err, err.stack);
      else {
        db.deletePic(req.params.id).then(response => {
          db.getPics().then(response2 => {
            res.status(200).json(response2);
          });
        });
      }
    });
  }
};
