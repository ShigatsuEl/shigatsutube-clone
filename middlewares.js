import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import routes from "./routes";

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_PRIVATE_KEY,
});

const multerVideo = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: "shigatsutube/video",
  }),
});
const multerAvatar = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: "shigatsutube/avatar",
  }),
});

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "ShigatsuTube";
  res.locals.routes = routes;
  res.locals.loggedUser = req.user || null;
  res.locals.dateFormatter = dateFormatter;
  next();
};

export const onlyPublic = (req, res, next) => {
  if (req.user) {
    res.redirect(routes.home);
  } else {
    next();
  }
};

export const onlyPrivate = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect(routes.home);
  }
};

export const dateFormatter = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}.${
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  }.${
    date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  } ${date.getHours()}시 ${date.getMinutes()}분`;
};
export const uploadVideo = multerVideo.single("videoFile");
export const uploadAvatar = multerAvatar.single("avatar");
