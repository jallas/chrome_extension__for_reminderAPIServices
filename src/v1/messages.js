module.exports = {
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  500: 'An Unknown Error Occured.',
  success: 'Successful',

  __404: (item) => `${item} Not Found`,
  __NOT_EXIST: (item) => `${item} does not exist`,
  __ALREADY_EXIST: (item) => `${item} already exist`,
}