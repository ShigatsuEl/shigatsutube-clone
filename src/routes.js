// Global
const HOME = "/";
const JOIN = "/join";
const LOGIN = "/login";
const LOGOUT = "/logout";
const SEARCH = "/search";

// Users
const USERS = "/users";
const USER_DETAIL = "/:id";
const EDIT_PROFILE = "/edit-profile";
const CHANGE_PASSWORD = "/change-password";
const ME = "/me";

// Videos
const VIDEOS = "/videos";
const UPLOAD = "/upload";
const VIDEO_DETAIL = "/:id";
const EDIT_VIDEO = "/:id/edit";
const DELETE_VIDEO = "/:id/delete";

// Github
const GITHUB = "/auth/github";
const GITHUB_CALLBACK = "/auth/github/callback";

// Google
const GOOGLE = "/auth/google";
const GOOGLE_CALLBACK = "/auth/google/callback";

// API
const API = "/api";
const LIKE_VIDEO = "/:id/like-video";
const REGISTER_VIEW = "/:id/view";
const ADD_COMMENT = "/:id/add-comment";
const HEART_COMMENT = "/:id/heart-comment";
const EDIT_COMMENT = "/:id/edit-comment";
const DELETE_COMMENT = "/:id/delete-comment";
const ADD_REPLY = "/:id/add-reply";
const EDIT_REPLY = "/:id/edit-reply";
const DELETE_REPLY = "/:id/delete-reply";
const HEART_REPLY = "/:id/heart-reply";

const routes = {
  home: HOME,
  join: JOIN,
  login: LOGIN,
  logout: LOGOUT,
  search: SEARCH,
  users: USERS,
  userDetail: (id) => {
    if (id) {
      return `/users/${id}`;
    } else {
      return USER_DETAIL;
    }
  },
  editProfile: EDIT_PROFILE,
  changePassword: CHANGE_PASSWORD,
  videos: VIDEOS,
  upload: UPLOAD,
  videoDetail: (id) => {
    if (id) {
      return `/videos/${id}`;
    } else {
      return VIDEO_DETAIL;
    }
  },
  editVideo: (id) => {
    if (id) {
      return `/videos/${id}/edit`;
    } else {
      return EDIT_VIDEO;
    }
  },
  deleteVideo: (id) => {
    if (id) {
      return `/videos/${id}/delete`;
    } else {
      return DELETE_VIDEO;
    }
  },
  github: GITHUB,
  githubCallback: GITHUB_CALLBACK,
  google: GOOGLE,
  googleCallback: GOOGLE_CALLBACK,
  me: ME,
  api: API,
  likeVideo: LIKE_VIDEO,
  registerView: REGISTER_VIEW,
  addComment: ADD_COMMENT,
  heartComment: HEART_COMMENT,
  editComment: EDIT_COMMENT,
  deleteComment: DELETE_COMMENT,
  addReply: ADD_REPLY,
  editReply: EDIT_REPLY,
  deleteReply: DELETE_REPLY,
  heartReply: HEART_REPLY,
};

export default routes;
