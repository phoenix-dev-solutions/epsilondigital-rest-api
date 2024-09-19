'use strict';

// Libraries
const axios = require('axios');

// Settings
const pjson = require('./package.json');

/**
 * Epsilondigital REST API wrapper
 *
 * @param {Object} opt
 */
class EpsilondigitalRestApi {
  /**
   * Class constructor.
   *
   * @param {Object} opt
   */
  constructor(opt) {
    if (!(this instanceof EpsilondigitalRestApi)) {
      return new EpsilondigitalRestApi(opt);
    }

    opt = opt || {};

    if (!opt.subscriptionKey) {
      throw new OptionsException('Subscription Key is required');
    }

    if (!opt.email) {
      throw new OptionsException('Email is required');
    }

    if (!opt.password) {
      throw new OptionsException('Password is required');
    }

    this.classVersion = pjson.version;

    this._setDefaultsOptions(opt);

    if (this.autoLogin) {
      this.login();
    }
  }

  /**
   * Set default options
   *
   * @param {Object} opt
   */

  _setDefaultsOptions(opt) {
    // Required
    this.url = 'https://myaccount.epsilonnet.gr';
    this.devUrl = 'https://beta-myaccount.epsilonnet.gr';
    this.baseUrl = null;
    this.subscriptionKey = opt.subscriptionKey;
    this.email = opt.email;
    this.password = opt.password;

    // Settings
    this.sandbox = opt.sandbox || false;
    this.autoLogin = opt.autoLogin || false;
    this.encoding = opt.encoding || 'utf8';
    this.timeout = opt.timeout;
    this.axiosConfig = opt.axiosConfig || {};

    // Epsilondigital
    this.token = {};
  }

  /**
   * Get URL
   *
   *
   * @return {String}
   */

  _getUrl(endpoint) {
    if (
      endpoint == '/api/account/loginToSubscription' ||
      endpoint == '/api/token/refresh'
    ) {
      if (this.sandbox) return this.devUrl + endpoint;
      else return this.url + endpoint;
    } else return this.baseUrl + endpoint;
  }

  /**
   * Do requests
   *
   * @param  {String} method
   * @param  {Object} data
   * @param  {String} endpoint
   * @param  {Object} params
   *
   * @return {Object}
   */

  _request(method, data, endpoint, params = {}) {
    const url = this._getUrl(endpoint);

    let options = {
      url: url,
      method: method,
      responseEncoding: this.encoding,
      timeout: this.timeout,
      responseType: 'application/json',
      headers: {
        Accept: 'application/json',
        ...(this?.token?.jwt && {
          Authorization: `Bearer ${this?.token?.jwt}`,
        }),
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent':
          'Epsilondigital REST API - JS Client/' + this.classVersion,
        'X-Version': '3.0',
      },
    };

    options.data = JSON.stringify(data);
    options.params = params;

    options = { ...options, ...this.axiosConfig };

    return axios(options);
  }

  /**
   * POST requests
   *
   * @param  {Object} data
   * @param  {String} endpoint
   * @param  {Object} params
   *
   * @return {Object}
   */

  async post(data, endpoint, params = {}) {
    // Check token if need refresh or relogin
    await this.checkToken(endpoint);

    // return response
    return await this._request('post', data, endpoint, params);
  }

  /**
   * LOGIN request
   *
   * @param  {Object} params
   *
   * @return {Object}
   */
  async login(params = {}) {
    const data = {
      subscriptionKey: this.subscriptionKey,
      email: this.email,
      password: this.password,
    };

    const epsilonData = await this.post(
      data,
      '/api/account/loginToSubscription',
      params
    )
      .then(function (response) {
        return JSON.parse(response.data);
      })
      .catch(function (error) {
        const errorData = JSON.parse(error?.response?.data ?? '{}');
        console.error(
          'Epsilondigital Login failed.Request Error Code :' +
            error?.response?.status +
            '. Message :' +
            errorData?.title
        );
        return error;
      });

    this.baseUrl = epsilonData?.url1;
    this.token = {
      jwt: epsilonData?.jwt,
      jwtExpiration: epsilonData?.jwtExpiration,
      jwtRefreshToken: epsilonData?.jwtRefreshToken,
      jwtRefreshTokenExpiration: epsilonData?.jwtRefreshTokenExpiration,
    };
  }

  /**
   * refresh
   *
   * @param  {Object} params
   *
   * @return {Object}
   */
  async refresh(params = {}) {
    const data = {
      token: this?.token?.jwt,
      refreshToken: this?.token?.jwtRefreshToken,
    };

    await this.post(data, '/api/token/refresh', params)
      .then(function (response) {
        this.baseUrl = response.data.url1;
        this.token = {
          jwt: response.data.jwt,
          jwtExpiration: response.data.jwtExpiration,
          jwtRefreshToken: response.data.jwtRefreshToken,
          jwtRefreshTokenExpiration: response.data.jwtRefreshTokenExpiration,
        };
        return response.data;
      })
      .catch(function (error) {
        const errorData = JSON.parse(error?.response?.data ?? '{}');
        console.error(
          'Epsilondigital token refresh failed.Request Error Code :' +
            error?.response?.status +
            '. Message :' +
            errorData?.title
        );
        // Promise.reject()
        throw new OptionsException(
          'Epsilondigital Login failed.Request Error Code :' +
            error.status +
            '. Message :' +
            error?.error
        );
      });
  }

  /**
   * Check Token request
   *
   * @param  {String} endpoint
   *
   * @return
   */
  async checkToken(endpoint) {
    if (
      endpoint == '/api/account/loginToSubscription' ||
      endpoint == '/api/token/refresh'
    )
      return;

    // Check if token is expired
    if (new Date().getTime() > new Date(this?.token?.jwtExpiration).getTime()) {
      // Check if refresh token is expired, then login
      if (
        new Date().getTime() >
        new Date(this?.token?.jwtRefreshTokenExpiration).getTime()
      ) {
        await this.login();
      }
      // else  if token is expired but refresh token is not, then refresh
      else {
        await this.refresh();
      }
    }
  }
}

module.exports = EpsilondigitalRestApi;

/**
 * Options Exception.
 */
class OptionsException {
  /**
   * Constructor.
   *
   * @param {String} message
   */
  constructor(message) {
    this.name = 'Options Error';
    this.message = message;
  }
}

exports.OptionsException = OptionsException;
