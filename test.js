const EpsilondigitalRestApi = require('./index');
const expect = require('chai').expect;

describe('Epsilondigital Login Testing', function () {
  const epsilondigital = new EpsilondigitalRestApi({
    subscriptionKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    email: 'user@epsilonnet.gr',
    password: '123456',
    sandbox: true,
  });

  let login;
  let sendData;

  describe('Epsilondigital Login', function () {
    before(async function () {
      login = await epsilondigital.login();
    });

    it('login return status 200', function () {
      expect(login.response.status).to.equal(200);
    });

    it('login response title = undefined', function () {
      const errorData = JSON.parse(login?.response?.data ?? '{}');
      expect(errorData?.title).to.equal(undefined);
    });

    after('', async function () {
      const errorData = JSON.parse(login?.response?.data ?? '{}');
      console.log();
      console.log('--------------------');
      console.error(
        'Epsilondigital Login failed.Request Error Code :' +
          login?.response?.status +
          '. Message :' +
          errorData?.title
      );
      console.log('--------------------');

      if (login.response.status == 200) {
        describe('Epsilondigital Testing send', function () {
          before(async function () {
            const data = {
              externalSystemId: '185',
              templateIdentifier: ' eInvoicing',
              transmissionType: 0,
              source: {},
            };

            sendData = await epsilondigital.post(data, '/api/send');
          });

          it('send return status 200', function () {
            expect(sendData.response.status).to.equal(200);
          });

          it('send response errorCode = null', function () {
            expect(sendData?.response?.data?.errorCode ?? '').to.equal(null);
          });
        });

        after('', async function () {
          console.log();
          console.log('--------------------');
          console.log(`send data with id: ${sendData?.response?.data}`);
          console.log('--------------------');
        });
      }
    });
  });
});
