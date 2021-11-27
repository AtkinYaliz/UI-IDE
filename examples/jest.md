# Jest

Mock Server: [Express Generator](https://www.npmjs.com/package/express-generator)

```javascript

const customers = require('../customers');
const {getPhonesHttpRequest} = require('../httpRequests/getPhonesHttpRequest');
jest.mock('../httpRequests/getPhonesHttpRequest');

describe('phones handler', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('customers call getPhonesHttpRequest', (done) => {
    getPhonesHttpRequest.mockImplementation(() => {
      return new Promise((res, rej) => res([]));
    });
    const params = [...];

    customers(...params).then(() => {
      expect(getPhonesHttpRequest).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('should log and send custom error response in case of error', () => {
    let req = {};
    let res = {json: jest.fn()};
    let next = jest.fn();
    const requestSpy = jest.spyOn(request, 'error');
    const resSpy = jest.spyOn(res, 'json');

    let err = new Error();
    err.status = 400;
    err.title = 'ob custom err';
    err.message = 'ob specific custom error';

    getCustomErrorResponse(err, req, res, next);

    expect(requestSpy).toHaveBeenCalled();
    expect(resSpy).toHaveBeenCalled();
    expect(resSpy).toHaveBeenCalledWith(err);
  });
});
```
