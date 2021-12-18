# Jest

Mock Server: [Express Generator](https://www.npmjs.com/package/express-generator)

```javascript

const customers = require('../customers');
const {getPhonesHttpRequest} = require('../httpRequests/getPhonesHttpRequest');
jest.mock('../httpRequests/getPhonesHttpRequest');

jest.mock('../../../../server/datasources/cassandra', () =>
  require('../../mocks/startupCassandra')
);

describe('phones handler', () => {
  afterEach(() => {
    // jest.clearAllMocks();
    jest.resetModules();
  });

  it('customers call getPhonesHttpRequest', (done) => {
    const obj = {a:1, b:2, f: () => {}};

    expect(1).toBe(1);
    expect(obj).toEqual({b:2, a:1});
    expect(obj.a).toBeDefined();
    expect(typeof obj).toBe('object');
    expect(typeof obj.f).toBe('function');
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
    const reqErrorSpy = jest.spyOn(req, 'error');
    const resJsonSpy = jest.spyOn(res, 'json');

    let err = new Error();
    err.status = 400;
    err.title = 'ob custom err';
    err.message = 'ob specific custom error';

    getCustomErrorResponse(err, req, res, next);

    expect(reqErrorSpy).toHaveBeenCalled();
    expect(resJsonSpy).toHaveBeenCalled();
    expect(resJsonSpy).toHaveBeenCalledWith(err);
  });
});
```
