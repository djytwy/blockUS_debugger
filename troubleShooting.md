#### 1. jwt issue
in globalCtx Jwt save in localStorage with useLocalStorage hook jwt only use in user first load page judge user isLogin.

jwt can be saved to localStorage in anytime (eg: login success, sign up success, modify user info). In this case shouldn't call globalCtx hook whick named setJwt.

Each jwt operation should be independent and unrelated.

setJwtGlobal: will call in globalCtx hook update isLogin = true.
setJwt: only set jwt in localStorage not update isLogin.