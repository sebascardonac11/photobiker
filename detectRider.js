function detectRider(bucket,photo){
  this.bucket=bucket;
  this.photo=photo;

  const AWS = require('aws-sdk')
  AWS.config.update({region:'us-east-2'});

  const config = new AWS.Config({
      accessKeyId:  process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
      });
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
  this.Labels = {};
  this.getLabel = function(){
    //console.log("Informacion de la imagen= ", JSON.stringify(params) );
      client.detectLabels(params, function(err, response) {
        if (err) {
          console.log(err, err.stack); // an error occurred
        } else {
        //console.log("Informacion de la imagen= ", JSON.stringify(response) );
          
          response.Labels.forEach(label => {
              if (label.Name == 'Motorcycle') {
                console.log("Moto detectada: "+ photo);
                label.Instances.forEach(instance => {
                    let box = instance.BoundingBox
                    //getText(box);

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

    //console.log("Informacion de la imagen= ", JSON.stringify(params2) );
        client.detectText(params2, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else{
             //console.log(params2);  
               //console.log(data);           // successful response
               console.log('Texto para la foto '+ photo)
          }
        });






                });
              }
          }) // for response.labels
          
        } // if
    });
    };

    this.getText = function(box){
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

    //console.log("Informacion de la imagen= ", JSON.stringify(params2) );
        client.detectText(params2, function(err, data) {
          if (err) console.log(err, err.stack); // an error occurred
          else{
             console.log(params2);  
               console.log(data);           // successful response
          }
        });
    };
}
module.exports = detectRider