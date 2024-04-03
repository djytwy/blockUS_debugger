export const REG_PASSWORD = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
export const REG_USERNAME = /^[A-Za-z\d-_]+$/;
export const REG_EMAIL = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
export const CODE_SECRET = 'chihyen!@&$,&handsome';
export const loginedIncludesPath = [
  '/home/e4c_records',
  '/home/account_setting',
  '/home/game_inventory',
  '/home',
  '/v1/nft',
  '/v1/chip',
  '/v1/games',
  '/fallenArena',
  '/fallenArena/login',
  '/fallenArena/signUp',
];
export const tag_map = {
  premium_fast_pass: 'Premium Fast Pass',
  epic_fast_pass: 'Epic Fast Pass',
  alpha_test_pass: 'Alpha Test Pass',
};
