import CryptoJS from 'crypto-js';
import { cloneDeep } from 'lodash';
import { CODE_SECRET } from '@/data/config';


export const stringify: typeof JSON.stringify = (value, replacer, space) =>
  JSON.stringify(
    value,
    (key, value_) => {
      const value = typeof value_ === 'bigint' ? value_.toString() : value_;
      return typeof replacer === 'function' ? replacer(key, value) : value;
    },
    space
  );

export const generateArray = (start: number, range: number) => {
  return Array.from(Array(range).keys()).map((i) => i + start);
};

export const getRndInteger = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

interface WalletsProps {
  address: string;
  type: 'Particle' | 'MetaMask';
  chain: 'Ethereum' | 'Sui' | 'Tezos' | 'EthereumGoerli';
}
export const decodeJWT = (
  jwt: string
): {
  email: string;
  exp: number;
  iat: number;
  particleJWT: string;
  uid: string;
  username: string;
  avatar: string;
  wallets: WalletsProps[] | null | undefined;
  blockus_sui_wallet?: string;
  account_tag?: 'alpha_test_pass' | 'epic_fast_pass' | 'premium_fast_pass';
} => {
  const userinfoStrings = jwt.split('.');
  const userinfo: {
    email: string;
    exp: number;
    iat: number;
    particleJWT: string;
    uid: string;
    username: string;
    wallets: [WalletsProps];
    avatar: string;
    account_tag?: 'alpha_test_pass' | 'epic_fast_pass' | 'premium_fast_pass';
  } = JSON.parse(decodeURIComponent(escape(window.atob(userinfoStrings[1].replace(/-/g, '+').replace(/_/g, '/')))));
  console.log(
    JSON.parse(decodeURIComponent(escape(window.atob(userinfoStrings[1].replace(/-/g, '+').replace(/_/g, '/')))))
  );
  // BTCToken is blockus Token
  // const BTCToken = userinfo.blockusJWT;
  const _userInfo = {};
  return userinfo;
};

export const getDeviceMsg: () => 'android 64' | 'android 32' | 'IOS' | 'other' = () => {
  if (typeof window !== 'undefined') {
    const userAgent = window.navigator.userAgent;
    if (userAgent.indexOf('Android') > -1) {
      const androidVersion = userAgent.match(/Android\s([0-9]+)/)?.[1];
      if (androidVersion && androidVersion.indexOf('64') > -1) {
        console.log('This is a 64-bit Android device.');
        return 'android 64';
      } else {
        console.log('This is a 32-bit Android device.');
        return 'android 32';
      }
    } else if (userAgent.indexOf('iPhone') > 1) {
      return 'IOS';
    } else return 'other';
  } else {
    return 'other';
  }
};

function encryptAES(data: string, key: CryptoJS.lib.WordArray, iv: CryptoJS.lib.WordArray): string {
  const encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv });
  return encrypted.toString();
}

function decryptAES(encryptedData: string, key: CryptoJS.lib.WordArray, iv: CryptoJS.lib.WordArray): string {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, key, { iv: iv });
  return decrypted.toString(CryptoJS.enc.Utf8);
}


export const decodeAES_JS: (token: string) => string = (token) => {
  const bytes = CryptoJS.AES.decrypt(token, CODE_SECRET);
  const blockUsToken = bytes.toString(CryptoJS.enc.Utf8);
  return blockUsToken;
};

export const genShowAddress: (address: string, headLength?: number, endLength?: number) => string = (
  address,
  headLength,
  endLength
) => {
  const _endLength = endLength ?? 5;
  return `${address.slice(0, headLength ?? 4)} ... ${address.slice(address.length - _endLength, address.length)}`;
};
