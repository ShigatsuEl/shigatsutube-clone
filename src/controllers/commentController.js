import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";
import Reply from "../models/Reply";
import { dateFormatter } from "../middlewares";

// Register Video View

export const postRegisterView = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    video.views += 1;
    video.save();
    res.status(200);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

// Add a Comment

export const postAddComment = async (req, res) => {
  const {
    params: { id },
    body: { comment },
  } = req;
  try {
    let newComment = await Comment.create({
      text: comment,
      creator: req.user.id,
    });
    newComment = await newComment.populate("creator").execPopulate();

    const video = await Video.findById(id).populate("creator");
    video.comments.push(newComment.id);
    video.save();

    const user = await User.findById(newComment.creator);
    user.comments.push(newComment.id);
    user.save();

    const parsedInfo = {
      videoCreator: video.creator.id,
      name: user.name,
      date: dateFormatter(newComment.createdAt),
      avatarUrl: user.avatarUrl,
      href: user.id,
      comment,
      commentHeart: newComment.heart.length,
      commentReplies: newComment.replies.length,
      commentId: newComment.id,
      commentCreator: newComment.creator.id,
    };
    res.json(parsedInfo);
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

// Heart Comment

export const postHeartComment = async (req, res) => {
  const {
    params: { id: commentId },
    body: { userId, isSelected },
  } = req;
  try {
    const comment = await Comment.findById(commentId);
    const user = await User.findById(userId);
    // comment heart && user.heartComments 가 있는지 없는지 확인하기 위한 if문
    if (comment.heart && user.heartComments) {
      if (!isSelected) {
        if (comment.heart.indexOf(userId) === -1) comment.heart.push(userId);
        if (user.heartComments.indexOf(commentId) === -1)
          user.heartComments.push(commentId);
        comment.save();
        user.save();
      } else {
        if (comment.heart.indexOf(userId) !== -1)
          comment.heart.splice(comment.heart.indexOf(userId), 1);
        if (user.heartComments.indexOf(commentId) !== -1)
          user.heartComments.splice(user.heartComments.indexOf(commentId), 1);
        comment.save();
        user.save();
      }
    }
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

// Edit Comment

export const postEditComment = async (req, res) => {
  const {
    params: { id },
    body: { editComment },
  } = req;
  try {
    await Comment.findByIdAndUpdate({ _id: id }, { text: editComment });
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};

// Delete Comment

export const postDeleteComment = async (req, res) => {
  const {
    params: { id: commentId },
    body: { videoId, userId },
  } = req;
  try {
    await Comment.findByIdAndRemove({ _id: commentId });
    await Video.updateOne({ _id: videoId }, { $pull: { comments: commentId } });
    await User.updateOne({ _id: userId }, { $pull: { comments: commentId } });
    await Reply.deleteMany({ whichComment: commentId });
  } catch (error) {
    res.status(400);
  } finally {
    res.end();
  }
};
