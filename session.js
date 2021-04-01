/* The following example list two objects in a bucket. */

const AWS = require('aws-sdk')
const detectRider = require('./detectRider')

const bucket = 'motos84' // the bucketname

var params = {Bucket: bucket};
var s3 = new AWS.S3();
s3.listObjects(params, function(err, data) {
   if (err){ console.log(err, err.stack); // an error occurred
   }else{               // successful response
   data.Contents.forEach(photo => {
      console.log("Foto analizar= "+photo.Key);
      const rider = detectRider.getLabel(bucket,photo.Key);   
      //rider.getLabel(bucket,photo.Key);
    });
 }
 });
