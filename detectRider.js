//Analizando la imagen.

const AWS = require('aws-sdk')
AWS.config.update({region:'us-east-2'});

const config = new AWS.Config({
	accessKeyId:  process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION
});
const client = new AWS.Rekognition();
var bucket = null;
var photo = null;
  exports.getLabel = function(bucket1,photo1){
  	bucket = bucket1;
  	photo = photo1;
	 
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
      if (label.Name == 'Motorcycle') {

        label.Instances.forEach(instance => {
          let box = instance.BoundingBox
         
         getText(box);
      })
        console.log("------------")
        console.log("")
      }
    }) // for response.labels
  } // if
	});
  }

  function getText(box){
  	console.log("Informacion de la imagen= ",box);
  	if (box.Height != null){
  		console.log("Bucket y photo ",bucket,photo);
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
              ]}
        };
        client.detectText(params2, function(err, data) {
	        if (err) console.log(err, err.stack); // an error occurred
	        else     console.log(data);           // successful response
        });
        return 0;
    }
  }


