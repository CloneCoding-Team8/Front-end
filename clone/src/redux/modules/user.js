import produce from "immer";
import { deleteCookie, setCookie } from "../../shared/Cookie";
import { apis, localStorageGet } from "../../shared/api";

// action
const LOGIN = "user/LOGIN";
const LOGOUT = "user/LOGOUT";
const USERINFO = "user/USERINFO";

// initialState
const initialState = {
  userinfo: {
    username: null,
    nickname: null,
    is_login: false,
  },
};

// action creator
export function login(id) {
  return { type: LOGIN, id };
}

export function logOut(userInfo) {
  return { type: LOGOUT, userInfo };
}

export function userinfo(info) {
  return { type: USERINFO, info };
}



//토큰 검사 미들웨어
export const loadUserAxios = () => {
  return async function (dispatch) {
    await apis
      .usercheck()

      .then((info) => {
        dispatch(userinfo(info))
        console.log('성공?');
      })

      .catch((err) => {
        console.log(err);
        dispatch(logOut());
      });
  };
};


// .then((res) => {
//     localStorage.getItem("token", res.data.token)
//     dispatch(login(id));
//     console.log('성공했니')
//     success = true;
//   })




// 로그인 미들웨어
export const loginAxios = (id, pw) => {
  return async function (dispatch) {
    
    console.log('로그인 될까')
    let success = null;
    await apis
      .login(id, pw)

      .then((res) => {
        localStorage.setItem("accesstoken", res.data.accesstoken)        
        setCookie("refreshtoken", res.data.refreshtoken)        
        dispatch(login(id));
        console.log('성공했니')
        success = true;
      })

      .catch((err) => {
        success = false;
        alert("아이디와 패스워드를 확인해주세요!");
      });
    return success;
  };
};




// 회원가입 미들웨어
export const signupAxios = (id, nick, pw, pwcheck) => {
  return async function (dispatch) {
    let res = null;
    await apis
      .signup(id, nick, pw, pwcheck)

      .then(() => {
        res = true;
        console.log('성공')
      })

      .catch((err) => {
        console.log(err);
        res = err;
      });
    return res;
  };
};


// reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {

    case "user/LOGIN": {
      const newUserInfo = {
        username: action.id,
        nickname: state.userinfo.nickname,
        is_login: true,
      };
      return { userinfo: newUserInfo };
    }

    case "user/LOGOUT": {
      deleteCookie("JWTToken");
      const newUserInfo = {
        username: null,
        nickname: null,
        is_login: false,
      };
      return { userinfo: newUserInfo };
    }

    case "user/USERINFO": {
      const newUserInfo = {
        username: action.info.data.principal.user.username,
        nickname: action.info.data.principal.user.nickname,
        is_login: true,
      };
      return { userinfo: newUserInfo };
    }

    // do reducer stuff
    default:
      return state;
  }
}





//middlewares

// 유저 정보 미들웨어
// export const loadUser = () => {
//   return async function (dispatch) {
//     await apis
//       .bookreviews()
//       .then((user_data) => {
//         dispatch(login(user_data.data));
//         console.log(user_data)
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };
// };