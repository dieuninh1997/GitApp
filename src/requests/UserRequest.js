import React from 'react';
import axios from 'axios';

export default class UserRequest{
  get(url) {
    return new Promise((resolve, reject) => {
      axios.get(url)
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      });
    });
  }
}
