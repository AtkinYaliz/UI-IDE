# Jest

```javascript

const beneficiaries = require('../beneficiaries');
const {
  getEaadsBeneficiariesRequest,
} = require('../httpRequest/getEaadsBeneficiariesHttpRequest');
jest.mock(
  '../httpRequest/getEaadsBeneficiariesHttpRequest'
);

describe('beneficiaries handler', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('beneficiaries call getEaadsBeneficiariesRequest', (done) => {
    getEaadsBeneficiariesRequest.mockImplementation(() => {
      return new Promise((res, rej) => res([]));
    });
    const params = [...];

    beneficiaries(...params).then(() => {
      expect(getEaadsBeneficiariesRequest).toHaveBeenCalledTimes(1);
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
