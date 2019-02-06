/* eslint-env node, jest, es6 */
/* eslint import/no-unresolved: 0 */
/* eslint import/extensions: 0 */
/* eslint max-nested-callbacks: 0 */
/* global Application */

import nock from 'nock';
import 'expect-more-jest';
/* local import */
import apiService from '@/services/api';
import request from '@/utils/request';
import endpoints from '@/resources/endpoints';
import mocks from '@/resources/mocks';


// uploadEmail: { method: 'post', path: `${baseUrl}/api/upload-email` },
// uploadedHistory: { method: 'get', path: `${baseUrl}/api/history?campaign_id=:campaignId` },

describe('== Api Service ==', () => {
  let baseUrl = '';
  beforeAll(() => {
    baseUrl = process.env.APP_BASE_URL || Application.globals.baseUrl;
  });
  afterAll(() => {
    baseUrl = null;
  });
  describe('The method:', () => {
    it('"uploadEmail" expect to call "request.post" of \'utility\', and returned body data', async (done) => {
      let data = {
        campaign_id: '5bc0e9a9f01f0e00153c94d2',
        api_driver: 'Eloqua',
        use_oauth: false,
        filename: 'prueba de mail',
        subject: 'prueba de subject',
      };
      let params = {
        endpoint: { method: 'post', path: `${baseUrl}/api/upload-email` },
        json: data,
      };
      let setDataMock = jest.fn().mockResolvedValue({
        url: 'http://localhost:3000/api/upload-email',
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {
          map: {
            'Cache-Control': ['no-cache, private'],
            Connection: ['Keep-Alive'],
            'Content-Length': ['20'],
            'Content-Type': ['application/json'],
            Date: ['Fri, 12 Oct 2018 19:56:02 GMT'],
            'Keep-Alive': ['timeout=15, max=100'],
            Server: ['Apache'],
            'X-Backend': ['977d91350fbb'],
            'X-RateLimit-Limit': ['60'],
            'X-RateLimit-Remaining': ['58'],
          },
        },
        body: {
          status: 'success',
        },
        bodyText: '{"status":"success"}',
      });
      request.post = setDataMock;
      await apiService.uploadEmail(data).then((result) => {
        expect(setDataMock.mock.calls).toHaveLength(1);
        expect(setDataMock.mock.calls[0][0]).toEqual(params);
        expect(result).toEqual({ status: 'success' });
        setDataMock = data = params = null;
        done();
      });
    });
    it('"uploadEmail" expect to call "request.post" of \'utility\', and returned a error data', async (done) => {
      let data = {
        campaign_id: '5bc0e9a9f01f0e00153c94d2',
        api_driver: 'Eloqua',
        use_oauth: false,
        filename: 'prueba de mail',
        subject: 'prueba de subject',
      };
      let params = {
        endpoint: { method: 'post', path: `${baseUrl}/api/upload-email` },
        json: data,
      };
      let responseError = {
        url: 'http://localhost:3000/api/upload-email',
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        bodyText: '{\n    "message": "error",\n    "exception": "Exception"}',
      };
      let setDataMock = jest.fn().mockRejectedValue(responseError);
      request.post = setDataMock;
      await apiService.uploadEmail(data).catch((error) => {
        expect(setDataMock.mock.calls).toHaveLength(1);
        expect(setDataMock.mock.calls[0][0]).toEqual(params);
        expect(error).toEqual(responseError);
        setDataMock = data = responseError = params = null;
        done();
      });
    });
    it('"uploadedHistory" expect to call "request.post" of \'utility\', and returned body data', async (done) => {
      let campaignId = '5bc0e9a9f01f0e00153c94d2';
      let params = {
        endpoint: { method: 'get', path: `${baseUrl}/api/history?campaign_id=:campaignId` },
        search: {
          campaignId,
        },
      };
      let responseResolved = {
        url: 'http://localhost:3000/api/history?campaign_id=5bc0e9a9f01f0e00153c94d2',
        ok: true,
        status: 200,
        statusText: 'OK',
        headers: {
          map: {
            'Cache-Control': ['no-cache, private'],
            Connection: ['Keep-Alive'],
            'Content-Length': ['377'],
            'Content-Type': ['application/json'],
            Date: ['Fri, 12 Oct 2018 20:50:46 GMT'],
            'Keep-Alive': ['timeout=15, max=98'],
            Server: ['Apache'],
            'X-Backend': ['977d91350fbb'],
            'X-RateLimit-Limit': ['60'],
            'X-RateLimit-Remaining': ['59'],
          },
        },
        body: [{
          _id: '5bc0fc5af01f0e001246d219',
          api: 'eloqua',
          campaign_id: '5bc0e9a9f01f0e00153c94d2',
          user_id: '5b8049b43133e000305c1852',
          ip: '',
          original_filename: 'prueba de mail',
          filename: 'prueba de mail.html',
          path: '',
          folder_id: '42',
          subject: '',
          preheader: '',
          updated_at: '2018-10-12 15:56:10',
          created_at: '2018-10-12 15:56:10',
          date: '2018-10-12 15:56:10',
          user: 'daniel',
        }],
        bodyText: `[{
          "_id":"5bc0fc5af01f0e001246d219",
          "api":"eloqua",
          "campaign_id":"5bc0e9a9f01f0e00153c94d2",
          "user_id":"5b8049b43133e000305c1852",
          "ip":"",
          "original_filename":"prueba de mail",
          "filename":"prueba de mail.html",
          "path":"",
          "folder_id":"42",
          "subject":"",
          "preheader":"",
          "updated_at":"2018-10-12 15:56:10",
          "created_at":"2018-10-12 15:56:10",
          "date":"2018-10-12 15:56:10",
          "user":"daniel"
        }]`,
      };
      let setDataMock = jest.fn().mockResolvedValue(responseResolved);
      request.get = setDataMock;
      await apiService.uploadedHistory(campaignId).then((result) => {
        expect(setDataMock.mock.calls).toHaveLength(1);
        expect(setDataMock.mock.calls[0][0]).toEqual(params);
        expect(result).toEqual(responseResolved.body);
        setDataMock = params = campaignId = responseResolved = null;
        done();
      });
    });
    it('"uploadedHistory" expect to call "request.post" of \'utility\', and returned a error data', async (done) => {
      let campaignId = '';
      let params = {
        endpoint: { method: 'get', path: `${baseUrl}/api/history?campaign_id=:campaignId` },
        search: {
          campaignId,
        },
      };
      let responseError = {
        message: 'Error parsing ObjectId string: undefined',
        exception: 'MongoDB\\Driver\\Exception\\InvalidArgumentException',
        file: '/usr/src/app/app/Http/Controllers/ApiController.php',
        line: 62,
        trace: [
          {
            file: '/usr/src/app/app/Http/Controllers/ApiController.php',
            line: 62,
            function: '__construct',
            class: 'MongoDB\\BSON\\ObjectId',
            type: '->',
          },
          {
            function: 'getHistory',
            class: 'Stensul\\Http\\Controllers\\ApiController',
            type: '->',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/Controller.php',
            line: 54,
            function: 'call_user_func_array',
          },
          {
            file: '/usr/src/app/vendor/laravel/framework/src/Illuminate/Routing/ControllerDispatcher.php',
            line: 45,
            function: 'callAction',
            class: 'Illuminate\\Routing\\Controller',
            type: '->',
          },
        ],
      };
      let setDataMock = jest.fn().mockRejectedValue(responseError);
      request.get = setDataMock;
      await apiService.uploadedHistory(campaignId).catch((error) => {
        expect(setDataMock.mock.calls).toHaveLength(1);
        expect(setDataMock.mock.calls[0][0]).toEqual(params);
        expect(error).toEqual(responseError);
        setDataMock = responseError = campaignId = params = null;
        done();
      });
    });
  });
});
