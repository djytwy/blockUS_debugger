"use client";
import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useLocalStorage } from "react-use";
import { useAccount, useDisconnect, useConnect } from "wagmi";
import { useSearchParams } from "next/navigation";
import CryptoJS from "crypto-js";
import { CODE_SECRET } from "@/data/config";
import { useRouter, usePathname } from "next/navigation";
import { loginedIncludesPath } from "@/data/config";
import { fetchPost, fetchGet, fetchPut } from "@/request";

interface dataProps {
  showSignIn: boolean;
  setShowSignIn: Dispatch<SetStateAction<boolean>>;
  showSignUp: boolean;
  setShowSignUp: Dispatch<SetStateAction<boolean>>;
  showError: boolean;
  setShowError: Dispatch<SetStateAction<boolean>>;
  errorMsg: string;
  setErrorMsg: Dispatch<SetStateAction<string>>;
  loading: LoadingProps; // global loading
  setLoading: Dispatch<SetStateAction<LoadingProps>>;
  showTips: boolean;
  setShowTips: Dispatch<SetStateAction<boolean>>;
  tips: TipsProps;
  setTips: Dispatch<SetStateAction<TipsProps>>;
  isLogin: boolean | undefined;
  setIsLogin: Dispatch<SetStateAction<boolean | undefined>>;
  userinfo: userInfoProps | undefined;
  setUserinfo: Dispatch<SetStateAction<userInfoProps | undefined>>;
  signUpWay:
    | "google"
    | "email"
    | "facebook.withEmail"
    | "facebook.withoutEmail";
  setSigUpWay: Dispatch<
    SetStateAction<
      "google" | "email" | "facebook.withEmail" | "facebook.withoutEmail"
    >
  >;
  // google login message return by goole will use in login flow and sign up flow so should in global context
  googleLoginMsg: googleLoginMsgProps | undefined;
  setGoogleLoginMsg: Dispatch<SetStateAction<googleLoginMsgProps | undefined>>;
  // facebook login message return by goole will use in login flow and sign up flow so should in global context
  facebookLoginMsg: facebookLoginMsgProps | undefined;
  setFacebookLoginMsg: Dispatch<
    SetStateAction<facebookLoginMsgProps | undefined>
  >;
  clearErrorsMsg: Function;
  showErrorMsg: (error: string) => void;
  resetCode: codeProps | undefined;
  setResetCode: Dispatch<SetStateAction<codeProps | undefined>>;
  showTipsMsg: (v: string, type?: "success" | "error" | undefined) => void;
  logOut: () => void;
  connectParticleWallet: () => void;
  setJwtGlobal: Dispatch<SetStateAction<string | undefined>>;
  setRecaptchaInfo: Dispatch<SetStateAction<recaptchaProps | undefined>>;
  recaptchaInfo: recaptchaProps | undefined;
  E4Cnum: number | string;
  points: number;
  E4CnumGame: number;
  E4Cstake: number;
  E4CHolder: number;
  hasSBT: boolean;
}

export const Ctx = createContext<dataProps>({
  showSignIn: false,
  setShowSignIn: () => {},
  showSignUp: false,
  setShowSignUp: () => {},
  showError: false,
  setShowError: () => {},
  errorMsg: "",
  setErrorMsg: () => {},
  loading: { show: false, content: "loading" },
  setLoading: () => {},
  isLogin: false,
  setIsLogin: () => {},
  userinfo: undefined,
  setUserinfo: () => {},
  signUpWay: "email",
  setSigUpWay: () => {},
  googleLoginMsg: undefined,
  setGoogleLoginMsg: () => {},
  facebookLoginMsg: undefined,
  setFacebookLoginMsg: () => {},
  clearErrorsMsg: () => {},
  showErrorMsg: (v) => {},
  resetCode: undefined,
  setResetCode: () => {},
  showTips: false,
  setShowTips: () => {},
  tips: {
    content: "",
    type: "success",
  },
  setTips: () => {},
  showTipsMsg: (v) => {},
  logOut: () => {},
  connectParticleWallet: () => {},
  setJwtGlobal: () => {},
  setRecaptchaInfo: () => {},
  recaptchaInfo: undefined,
  E4Cnum: 0,
  points: 0,
  E4CHolder: 0,
  E4Cstake: 0,
  E4CnumGame: 0,
  hasSBT: false,
});

interface Props {
  children: ReactNode;
}

interface WalletsProps {
  address: string;
  type: "Particle" | "MetaMask";
  chain: "Ethereum" | "Sui" | "Tezos" | "EthereumGoerli";
}

interface userInfoProps {
  email?: string;
  account_tag?: "alpha_test_pass" | "epic_fast_pass" | "premium_fast_pass";
  exp?: number;
  iat?: number;
  particleJWT?: string;
  uid?: string;
  username?: string;
  avatar?: string;
  social_account_google?: string;
  wallets?: WalletsProps | null | undefined;
  blockus_sui_wallet?: string;
  showSuiAddress?: string;
}

interface googleLoginMsgProps {
  email: string;
  hash: string;
}

interface facebookLoginMsgProps {
  hash: string;
  userId: string;
  email?: string;
}

interface codeProps {
  email: string;
  validTill: number;
  isAvailable: boolean;
}

// whatever judge user by game client or enter url manual
interface FallenArenaProps {
  timestamp: number;
  text: "ambrus";
}

interface TipsProps {
  content: string;
  type: "success" | "error";
}

// facebook login status
interface authResponseProps {
  authResponse?: {
    accessToken: string;
    data_access_expiration_time: number;
    expiresIn: number;
    graphDomain: string;
    signedRequest: string;
    userID: string;
  };
  status?: "connected" | "unknown";
}

// google recaptcha message
interface recaptchaProps {
  startTime: number;
  times: number;
}

interface LoadingProps {
  show: boolean;
  content?: ReactNode;
}

const Provider = ({ children }: Props) => {
  const [showSignIn, setShowSignIn] = useState(true);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState<LoadingProps>({
    show: false,
    content: "loading",
  });
  // if the isLogin is undefined it's mean front end loading login state.
  const [isLogin, setIsLogin] = useState<boolean | undefined>();
  const [isBindWallet, setIsBindWallet] = useState<boolean | undefined>();
  const [isBindEmail, setIsBindEmail] = useState<boolean | undefined>();
  const [jwt, setJwtGlobal] = useLocalStorage<string | undefined>("jwt");
  const [recaptchaInfo, setRecaptchaInfo] = useLocalStorage<
    recaptchaProps | undefined
  >("recaptchaInfo");
  const [userinfo, setUserinfo] = useState<userInfoProps>();
  const [signUpWay, setSigUpWay] = useState<
    "google" | "email" | "facebook.withEmail" | "facebook.withoutEmail"
  >("email");
  const [googleLoginMsg, setGoogleLoginMsg] = useState<googleLoginMsgProps>();
  const [facebookLoginMsg, setFacebookLoginMsg] =
    useState<facebookLoginMsgProps>();
  const { address, connector, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect({
    onSuccess(data) {
      // todo: how to judge the particle wallet logout success ?
      setTimeout(() => {
        location.replace("/login");
      }, 1200);
    },
  });
  const searchParams = useSearchParams();
  const [resetCode, setResetCode] = useState<codeProps | undefined>();
  const [showTips, setShowTips] = useState<boolean>(false);
  const [tips, setTips] = useState<TipsProps>({
    content: "",
    type: "success",
  });
  const router = useRouter();
  const pathName = usePathname();
  const [E4Cnum, setE4Cnum] = useState<number | string>("--");
  const [points, setPoints] = useState<number>(0);
  const [E4CnumGame, setE4CnumGame] = useState<number>(0);
  const [E4Cstake, setE4Cstake] = useState<number>(0);
  const [E4CHolder, setE4CHolder] = useState<number>(0);
  const [hasSBT, setHasSBT] = useState<boolean>(false);

  // connect wallet
  useEffect(() => {
    connect({
      connector: connectors.find((e) => e.name === "Particle Auth"),
    });
  }, [userinfo, jwt]);

  // reset account
  useEffect(() => {
    const decodeEmailAndCheck = async () => {
      const isAvailableCode = async (code: string) => {
        const _isAvailable = await fetch(
          "/api/reset?" +
            new URLSearchParams({
              code: encodeURIComponent(code),
            }),
        );
        const resJson = await _isAvailable.json();
        if (resJson.success) {
          return true;
        } else {
          return false;
        }
      };
      const _code = searchParams.get("code");
      if (_code && !resetCode) {
        try {
          const bytes = CryptoJS.AES.decrypt(
            decodeURIComponent(_code),
            CODE_SECRET,
          );
          const JsonText: codeProps = JSON.parse(
            bytes.toString(CryptoJS.enc.Utf8),
          );
          const _isAvailable = await isAvailableCode(_code);
          setResetCode({ ...JsonText, isAvailable: _isAvailable });
          setShowSignIn(true);
        } catch (error) {
          setShowSignIn(true);
          setResetCode({ email: "", validTill: 1, isAvailable: false });
        }
      }
    };

    if (!pathName.includes("fallenArena")) decodeEmailAndCheck();
  }, [searchParams]);

  // judge from search Params to sign up flow
  useEffect(() => {
    const judgeSignUpFlow = () => {
      const _code = searchParams.get("code");
      const signUp = searchParams.get("signUp");
      if (signUp && !_code) {
        setShowSignIn(false);
        setShowSignUp(true);
      } else {
        console.log("code:", _code, "signUp:", signUp);
      }
    };
    judgeSignUpFlow();
  }, [searchParams]);

  // query Facebook user status
  const getFacebookLoginStatus = () => {
    return new Promise<authResponseProps>((resolve, reject) => {
      // @ts-ignore
      window.FB.getLoginStatus((response: authResponseProps) => {
        console.log("getFacebookLoginStatus", response);
        resolve(response);
      });
    });
  };

  // facebook SDK init
  useEffect(() => {
    const initFacebookSdk = () => {
      return new Promise((resolve, reject) => {
        // Load the Facebook SDK asynchronously
        // @ts-ignore
        window.fbAsyncInit = () => {
          // @ts-ignore
          window.FB.init({
            appId: process.env.NEXT_PUBLIC_FB_APP_ID,
            cookie: true,
            xfbml: true,
            version: "v18.0",
          });
          // Resolve the promise when the SDK is loaded
          resolve("");
        };
      });
    };

    const initFB = async () => {
      await initFacebookSdk();
      const res = await getFacebookLoginStatus();
      if (res) console.log("FB init:", res);
    };
    initFB();
  }, []);

  // url change event use to check user bind wallet or bind email
  useEffect(() => {
    if (isBindEmail === false || isBindWallet === false) {
      setTimeout(() => {
        showErrorMsg(
          `Please bind your ${
            isBindEmail === false ? "email" : "wallet"
          } first.`,
        );
      }, 500);
    }
  }, [pathName, isBindEmail, isBindWallet]);

  // SBT
  useMemo(async () => {
    if (userinfo?.wallets?.address) {
      const hasSBT = await fetchGet<"false" | "true">(`/api/home?`, {
        local: true,
        params: { address: userinfo?.wallets?.address, sbt: true },
      });
      if (hasSBT === "true") {
        setHasSBT(true);
      }
    }
  }, [userinfo?.wallets?.address]);

  // e4c points
  useMemo(async () => {
    // old V1 :
    const E4CnumAndPoints = async () => {
      const resAlphaTest = fetchGet<{ score: number; e4c: number }>(
        `/api/home?uid=${userinfo?.uid}`,
        { local: true },
      );
      const resHiveStake = fetchGet<string>(
        `/api/home?address=${userinfo?.wallets?.address}`,
        { local: true },
      );
      const paidMint = fetchGet<number>(
        `/api/home?address=${userinfo?.wallets?.address}&paid=true`,
        { local: true },
      );
      const newBalance = fetchGet<number>(`/api/home?`, {
        local: true,
        params: { uid: userinfo?.uid, newBalance: "newBalance" },
      });
      const reqList = [resAlphaTest, resHiveStake, paidMint, newBalance];
      const resList = await Promise.all(reqList);
      const _resList = resList.map((e) =>
        typeof e === "object"
          ? e.e4c
          : typeof e === "number"
            ? e
            : Number.isNaN(parseInt(e))
              ? 0
              : parseInt(e),
      );
      // old e4c :
      // const E4c = _resList.reduce((pre, now) => pre + now);
      // v2 e4c:
      const E4c = resList[3];
      setE4CHolder(_resList[2]);
      setE4Cstake(_resList[1]);
      // @ts-ignore
      return { e4c: E4c, points: resList[0]["score"], E4CnumGame: _resList[0] };
    };
    // const E4CnumAndPoints = async () => {
    //   const resHiveStake = fetchGet<string>(`/api/home?uid=${userinfo?.uid}`, { local: true });
    // }
    // login success page don't request interface which interrupt countdown
    if (userinfo?.wallets?.address && userinfo?.uid && pathName !== "/login") {
      const _E4CnumAndPoints = await E4CnumAndPoints();
      // @ts-ignore
      setE4Cnum(_E4CnumAndPoints.e4c);
      setPoints(_E4CnumAndPoints.points);
      setE4CnumGame(_E4CnumAndPoints.E4CnumGame);
    } else {
      setE4Cnum("--");
      setPoints(0);
      setE4CnumGame(0);
    }
  }, [userinfo?.wallets?.address, userinfo?.uid]);

  const clearErrorsMsg = () => {
    setErrorMsg("");
    setShowError(false);
  };

  const showErrorMsg = (v: string) => {
    setErrorMsg(v);
    setShowError(true);
  };

  const showTipsMsg = (v: string, type?: "success" | "error") => {
    setShowTips(true);
    setTips({
      content: v,
      type: type ?? "success",
    });
    setTimeout(() => {
      setShowTips(false);
    }, 3000);
  };

  const logOut = async () => {
    setJwtGlobal("");
    if (await connector?.isAuthorized()) await connector?.disconnect();
    disconnect();
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("jwt"); // double confirm remove "jwt" in localStorage
    }
    const _FB_logout = () => {
      return new Promise<authResponseProps>((resolve, reject) => {
        // @ts-ignore
        window.FB.logout((response: authResponseProps) => {
          console.log("logout:", response);
          resolve(response);
        });
      });
    };

    const resFB = await getFacebookLoginStatus();
    if (resFB.status === "connected") await _FB_logout();
  };

  const connectParticleWallet = () => {
    connect({
      connector: connectors.find((e) => e.name === "Particle Auth"),
    });
  };

  return (
    <Ctx.Provider
      value={{
        showSignIn,
        setShowSignIn,
        showSignUp,
        setShowSignUp,
        showError,
        setShowError,
        errorMsg,
        setErrorMsg,
        loading,
        setLoading,
        isLogin,
        setIsLogin,
        userinfo,
        setUserinfo,
        signUpWay,
        setSigUpWay,
        clearErrorsMsg,
        showErrorMsg,
        googleLoginMsg,
        setGoogleLoginMsg,
        facebookLoginMsg,
        setFacebookLoginMsg,
        setResetCode,
        resetCode,
        showTips,
        setShowTips,
        tips,
        setTips,
        showTipsMsg,
        logOut,
        connectParticleWallet,
        setJwtGlobal,
        recaptchaInfo,
        setRecaptchaInfo,
        E4Cnum,
        points,
        E4CHolder,
        E4Cstake,
        E4CnumGame,
        hasSBT,
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

const useGlobalContext = () => useContext(Ctx);

export { Provider as GlobalProvider, useGlobalContext };
