// Add to your package.json
// npm install aws-sdk --save-dev

const AWS = require('aws-sdk')

const bucket = 'motos84' // the bucketname without s3://
const photo  = 'FB_IMG_1547481892771.jpg' // the name of file

const config = new AWS.Config({
  accessKeyId:  process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
})

AWS.config.update({region:'us-east-2'});
const client = new AWS.Rekognition();
const params = {
  Image: {
    S3Object: {
      Bucket: bucket,
      Name: photo
    },
  },
  MaxLabels: 10
}

client.detectLabels(params, function(err, response) {
  if (err) {
    console.log(err, err.stack); // an error occurred
  } else {
    console.log(`Detected labels for: ${photo}`)

    response.Labels.forEach(label => {
     // if (label.Name == 'Motorcycle') {
        console.log('Encontre una moto.')
        console.log(`Label:      ${label.Name}`)
        console.log(`Confidence: ${label.Confidence}`)
        console.log("Instances:")

        label.Instances.forEach(instance => {
          let box = instance.BoundingBox
          console.log("  Bounding box:")
          console.log(`    Top:        ${box.Top}`)
          console.log(`    Left:       ${box.Left}`)
          console.log(`    Width:      ${box.Width}`)
          console.log(`    Height:     ${box.Height}`)
          console.log(`  Confidence: ${instance.Confidence}`)


        const params2 = {
          Image: {
            S3Object: {
            Bucket: bucket,
            Name: photo
            },
          }, 
          Filters: {
              RegionsOfInterest: [{
                 BoundingBox: {
                  Height: box.Height,
                  Left: box.Left,
                  Top: box.Top,
                  Width: box.Width
                }
              }
      /* more items */
              ]
          }
        }
      /*  client.detectText(params2, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});*/


        })

        console.log("Parents:")
        label.Parents.forEach(parent => {
          console.log(`  ${parent.Name}`)
        })


        console.log("------------")
        console.log("")
      
    }) // for response.labels
  } // if
});
