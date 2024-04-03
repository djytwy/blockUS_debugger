import { request } from '@/request';

const env = process.env.NEXT_PUBLIC_ENV as string;
const env_interface = env === 'staging' ? 'v2-testing' : 'v2';

export const emailAvailability = (email: string) =>
  request.client.get<boolean | string>(`/${env_interface}/account/availability/email`, {
    params: {
      email: email.toLocaleLowerCase(),
    },
  });

export const userNameAvailability = (username: string) =>
  request.client.get<boolean | string>(`/${env_interface}/account/availability/username`, {
    params: {
      username: username,
    },
  });

interface RespProps {
  message?: string;
  name?: string;
  options?: any;
  response?: { statusCode: number; message: string };
  status?: number;
}

export const sendOTP = (email: string) =>
  request.client.post<RespProps | boolean>(`/${env_interface}/account/code/send`, {
    email: email.toLocaleLowerCase(),
  });

export const verifyOTP = (email: string, code: string) =>
  request.client.post<boolean>(`/${env_interface}/account/code/verify`, {
    email: email.toLocaleLowerCase(),
    code: code,
  });

interface SignUpProps {
  accessToken?: string;
  message?: string;
  name?: string;
}

export const register = (email: string, username: string, hash1: string, newsLetterSubscription: boolean) =>
  request.client.post<SignUpProps>(`/${env_interface}/account/register/email`, {
    email: email.toLocaleLowerCase(),
    username: username,
    hash1: hash1,
    newsLetterSubscription: newsLetterSubscription,
  });

interface LoginProps {
  accessToken?: string;
  message?: string;
  name?: string;
  options?: {};
  resopnse?: any;
  statusCode?: number;
  status: number;
}

export const login = (email: string, hash1: string) =>
  request.client.post<LoginProps>(`/${env_interface}/account/login/email`, {
    email: email.toLocaleLowerCase(),
    hash1: hash1,
  });

export const queryEmail = (username: string) =>
  request.client.get<string>(`/${env_interface}/account/email`, {
    params: {
      username: username,
    },
  });

export const sendLog = (
  event:
    | 'signup_email.entered'
    | 'signup_code.sendAgain'
    | 'signup_code.entered'
    | 'signup_username.entered'
    | 'signup_password.entered'
) =>
  request.client.post(`/${env_interface}/account/log`, {
    action: event,
    data: {},
  });

interface AddressProps {
  address: string;
  type: 'Particle' | 'MetaMask';
  chain: 'Ethereum' | 'Sui' | 'Tezos' | 'EthereumGoerli';
}
export const updateAddress = (email: string, wallet: AddressProps) =>
  request.client.put(`/${env_interface}/account/wallet`, {
    email: email.toLocaleLowerCase(),
    wallet: wallet,
  });

export const loginWithWallet = (address: string) =>
  request.client.post<string>(`/${env_interface}/account/code/sign`, {
    address: address,
  });

export const sendSignMessage = (address: string, signature: string) =>
  request.client.post(`/${env_interface}/account/login/metamask`, {
    address: address,
    signature: signature,
  });

export const registerWallet = (address: string, signature: string) =>
  request.client.post(`/${env_interface}/account/register/metamask`, {
    address: address,
    signature: signature,
  });

export const googleRegister = (email: string, username: string, hash1: string) =>
  request.client.post<SignUpProps>(`/${env_interface}/account/register/google`, {
    email: email.toLocaleLowerCase(),
    username: username,
    hash1: hash1,
    newsLetterSubscription: true,
    referralId: '',
  });

export const googleLogin = (email: string, hash1: string) =>
  request.client.post<LoginProps>(`/${env_interface}/account/login/google`, {
    email: email.toLocaleLowerCase(),
    hash1: hash1,
  });

export const facebookLogin = (userId: string, hash1: string) =>
  request.client.post<LoginProps>(`/${env_interface}/account/login/facebook`, {
    userID: userId,
    hash1: hash1,
  });

export const facebookRegister = (email: string, username: string, hash1: string, userId: string) =>
  request.client.post<SignUpProps>(`/${env_interface}/account/register/facebook`, {
    userID: userId,
    email: email.toLocaleLowerCase(),
    username: username,
    hash1: hash1,
    newsLetterSubscription: true,
    referralId: '',
  });

export const changePassword = (oldPassword: string, newPassword: string, email: string) =>
  request.client.post<boolean>(`/${env_interface}/account/password`, {
    oldPassword: oldPassword,
    newPassword: newPassword,
    email: email.toLocaleLowerCase(),
  });

// export const changeAvatar = () =>
//   request.client.put
