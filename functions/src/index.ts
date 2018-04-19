const functions = require('firebase-functions');
import * as rp from 'request-promise';

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.refreshAirbnbCaledendar = functions.https.onRequest((req, res) => {
  rp({
    uri: 'https://www.airbnb.be/calendar/ical/12102270.ics?s=43d614d026f02aef4ac8431f625b3433',
    method: 'GET'
  }).then(result => {
    if (result.success) {
      console.info('successfully fetched airbnb data: ', JSON.stringify(result));
      res.status(200).send('refresh successful');
    } else {
      console.error('fetching airbnb calendar failed: ', JSON.stringify(result));
      res.status(200).send('refresh failed: ' + JSON.stringify(result));
    }
  })
});
