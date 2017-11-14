import Q from 'q';
import _ from 'lodash';
import request from '../utils/request';
import endpoints from '../resources/endpoints';

export default {
  uploadImages(data) {
    const deferred = Q.defer();
    const endpoint = endpoints.image.uploadImage;

    const promises = [];

    _.each(data.images, (image) => {
      const params = {
        endpoint,
        json: {
          campaign_id: data.campaignId,
          data_image: image,
        },
      };
      promises.push(request[endpoint.method](params));
    });

    const images = [];

    Q.all(promises).then((responses) => {
      _.each(responses, (imageResponse) => {
        images.push(imageResponse.body.path);
      });

      deferred.resolve(images);
    }).catch((err) => {
      deferred.reject(err);
    });

    return deferred.promise;
  },

};
