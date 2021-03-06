import axios from "axios";
import { addNotificationModal } from "./notificationModal";

const addCommentForm = document.getElementById("jsAddCommentForm");
const addCommentInput = document.getElementById("jsAddCommentInput");
const buttonBox = document.getElementById("jsBtnBox");
const cancelBtn = document.getElementById("jsCancelBtn");
const commentBtn = document.getElementById("jsCommentBtn");
const commentList = document.getElementById("jsCommentList");

let replyBox;
let replyForm;
let replyInput;
let replyBtnBox;
let replyCancelBtn;
let replySubmitBtn;
let replyViewBox;
let replyList;

// Comment가 추가 & 삭제되면 Comment 수를 실시간으로 보여주는 이벤트함수
const increaseNumber = () => {
  const commentNumber = document.getElementById("jsCommentNumber");
  const commentLiteral = document.getElementById("jsLiteralComment");
  commentNumber.textContent = parseInt(commentNumber.textContent, 10) + 1;
  // Comment 수가 0보다 작아지는 일이 없게 방지
  if (commentNumber.textContent <= 0) {
    commentNumber.textContent = "0";
    commentLiteral.textContent = " Comments";
    // Comment 수가 "1"이 되면 Comments가 아닌 Comment로 변경
  } else if (commentNumber.textContent === "1") {
    commentLiteral.textContent = " Comment";
    // 그 외는 Comments로 변경
  } else {
    commentLiteral.textContent = " Comments";
  }
};

// Comment 입력을 마치면 실시간처럼 Comment가 생기는 Fake 함수
const addCommentBlock = (parsedInfo) => {
  // CommentBlock Element
  const commentBlock = document.createElement("li");
  // 비디오 크리에이터와 커멘트 크리에이트가 같다면 owner 블락을 생성
  if (parsedInfo.videoCreator === parsedInfo.commentCreator) {
    commentBlock.classList.add("comment__block-owner");
    // 비디오 크리에이터와 커멘트 크리에이트가 다르다면 visitor 블락을 생성
  } else {
    commentBlock.classList.add("comment__block-visitor");
  }
  commentBlock.classList.add("comment__block");
  commentBlock.id = parsedInfo.commentId;
  commentBlock.dataset.id = parsedInfo.commentId;
  commentList.prepend(commentBlock);

  // Left Element
  const left = document.createElement("div");
  left.classList.add("comment__left");
  const img = document.createElement("img");
  img.classList.add("comment__publish-avatar");
  img.src = parsedInfo.avatarUrl;
  left.append(img);
  commentBlock.append(left);

  // Right Element
  const right = document.createElement("div");
  right.classList.add("comment__right");
  commentBlock.append(right);

  // Comment Info
  const info = document.createElement("div");
  info.classList.add("comment__info");
  right.append(info);

  // Comment Writer & createdAt
  const address = document.createElement("a");
  address.classList.add("comment__writer");
  address.href = `/users/${parsedInfo.href}`;
  const writerName = document.createElement("span");
  writerName.classList.add("comment__writer-name");
  writerName.textContent = parsedInfo.name;
  const createdAt = document.createElement("span");
  createdAt.classList.add("comment__createdAt");
  createdAt.textContent = parsedInfo.date;
  address.append(writerName);
  info.append(address);
  info.append(createdAt);

  // Comment Content
  const content = document.createElement("div");
  content.classList.add("comment__content");
  content.id = "jsCommentContent";
  const text = document.createElement("div");
  text.classList.add("comment__text");
  text.textContent = parsedInfo.comment;
  content.append(text);
  right.append(content);

  // Comment Edit Box(hidden)
  const editBox = document.createElement("div");
  editBox.classList.add("comment__editBox", "hidden");
  editBox.id = "jsCommentEditBox";
  editBox.dataset.id = parsedInfo.commentId;
  right.append(editBox);

  const editForm = document.createElement("form");
  editForm.classList.add("comment__editForm");
  editForm.id = "jsCommentEditForm";
  editBox.append(editForm);

  const editInput = document.createElement("div");
  editInput.classList.add("comment__editInput");
  editInput.id = "jsCommentEditInput";
  editInput.contentEditable = true;
  editInput.setAttribute("name", "editComment");
  editInput.setAttribute("placeholder", "Edit your comment");
  editInput.setAttribute("autocomplete", "off");
  editInput.setAttribute("required", "true");
  editInput.textContent = parsedInfo.comment;
  editForm.append(editInput);

  const editBtnBox = document.createElement("div");
  editBtnBox.classList.add("editBtnBox");
  editForm.append(editBtnBox);

  const editCancelBtn = document.createElement("button");
  editCancelBtn.classList.add("comment__editCancelBtn", "commentCancelBtn");
  editCancelBtn.id = "jsCommentEditCancelBtn";
  editCancelBtn.textContent = "CANCEL";
  editBtnBox.append(editCancelBtn);

  const editSaveBtn = document.createElement("button");
  editSaveBtn.classList.add("comment__editSaveBtn", "commentSaveBtn");
  editSaveBtn.id = "jsCommentEditSaveBtn";
  editSaveBtn.textContent = "SAVE";
  editBtnBox.append(editSaveBtn);

  // Subinfo
  // Subinfo Heart
  const subInfo = document.createElement("div");
  subInfo.classList.add("comment__subinfo");
  subInfo.id = "jsCommentSubinfo";
  right.append(subInfo);

  const commentHeart = document.createElement("span");
  commentHeart.classList.add("comment__heart");
  subInfo.append(commentHeart);

  const heartIcon = document.createElement("i");
  heartIcon.classList.add("fas", "fa-heart", "heartBtn");
  commentHeart.append(heartIcon);

  const heartNumber = document.createElement("span");
  heartNumber.classList.add("comment__heart-number");
  heartNumber.id = "jsHeartNumber";
  heartNumber.textContent = parsedInfo.commentHeart;
  commentHeart.append(heartNumber);

  // Subinfo Comment Reply
  const commentReply = document.createElement("span");
  commentReply.classList.add("comment__reply");
  subInfo.append(commentReply);

  const commentReplyBtn = document.createElement("i");
  commentReplyBtn.classList.add("fas", "fa-reply", "replyBtn");
  commentReply.append(commentReplyBtn);

  const commentReplyCount = document.createElement("span");
  commentReplyCount.classList.add("reply__count");
  commentReplyCount.id = "jsCommentEdit";
  commentReplyCount.textContent = parsedInfo.commentReplies;
  commentReply.append(commentReplyCount);

  // Subinfo Comment Edit
  const commentEdit = document.createElement("span");
  commentEdit.classList.add("comment__editBtn");
  commentEdit.id = "jsCommentEdit";
  subInfo.append(commentEdit);

  const commentEditBtn = document.createElement("i");
  commentEditBtn.classList.add("far", "fa-edit", "editBtn");
  commentEdit.append(commentEditBtn);

  // Subinfo Comment Delete
  const commentDelete = document.createElement("span");
  commentDelete.classList.add("comment__deleteBtn");
  commentDelete.id = "jsCommentDelete";
  subInfo.append(commentDelete);

  const commentDeleteBtn = document.createElement("i");
  commentDeleteBtn.classList.add("far", "fa-trash-alt", "deleteBtn");
  commentDelete.append(commentDeleteBtn);

  // Reply Box
  replyBox = document.createElement("div");
  replyBox.classList.add("reply__box", "hidden");
  replyBox.id = "jsReplyBox";
  commentList.prepend(replyBox);

  replyForm = document.createElement("form");
  replyForm.classList.add("reply__form", "replyForm");
  replyForm.id = "jsReplyForm";
  replyBox.append(replyForm);

  replyInput = document.createElement("input");
  replyInput.classList.add("reply__input");
  replyInput.id = "jsReplyInput";
  replyInput.setAttribute("type", "text");
  replyInput.setAttribute("name", "reply");
  replyInput.setAttribute("placeholder", "Feel free to reply comment~");
  replyInput.setAttribute("autocomplete", "off");
  replyInput.setAttribute("required", "required");
  replyForm.append(replyInput);

  replyBtnBox = document.createElement("div");
  replyBtnBox.classList.add("reply__btnBox");
  replyBtnBox.id = "jsBtnBox";
  replyForm.append(replyBtnBox);

  replyCancelBtn = document.createElement("button");
  replyCancelBtn.classList.add("cancel__btn", "replyCancelBtn");
  replyCancelBtn.id = "jsCancelBtn";
  replyCancelBtn.setAttribute("type", "button");
  replyCancelBtn.textContent = "CANCEL";
  replyBtnBox.append(replyCancelBtn);

  replySubmitBtn = document.createElement("button");
  replySubmitBtn.classList.add("comment__btn", "replySaveBtn");
  replySubmitBtn.id = "jsCommentBtn";
  replySubmitBtn.setAttribute("type", "button");
  replySubmitBtn.textContent = "COMMENT";
  replyBtnBox.append(replySubmitBtn);

  // Replies View Box
  replyViewBox = document.createElement("div");
  replyViewBox.classList.add("replies__view-box");
  replyViewBox.id = "jsReplyContainer";
  commentList.prepend(replyViewBox);
  // commentList에 commentBlock & replyBox & replyViewBox를 셋 다 추가하고
  // commentBlock / replyBox / replyViewBox 순서로 넣는다.(순서가 중요!)
  commentList.insertBefore(replyBox, replyViewBox);
  commentList.insertBefore(commentBlock, replyBox);

  replyList = document.createElement("ul");
  replyList.classList.add("replies__list");
  replyList.id = "jsReplyList";
  replyViewBox.append(replyList);
};

// Add Comment Form이 제출되면 백엔드에 데이터를 요청하는 AXIOS(AJAX) 함수
const sendComment = async (comment) => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/add-comment`,
    method: "POST",
    data: {
      comment,
    },
  });
  if (response.status === 200) {
    // 클라이언트가 서버에 요청을 하고 요청이 정상적으로 승인된 후 브라우저에 응답이 정상적으로 이루어질 경우 발생하는 조건문
    addCommentBlock(response.data);
    increaseNumber();
    addNotificationModal("Successfully", "added", "comment");
    // 클라이언트가 서버에 요청을 했으나 요청이 정상적으로 이루어지지 않아 브라우저에 에러를 보낼 때 발생하는 조건문
  } else {
    addNotificationModal("Failed to", "added", "comment");
  }
};

// Add Comment Form이 제출되면 실행되는 함수
const handleSubmit = (event) => {
  event.preventDefault();
  const comment = addCommentInput.value;
  sendComment(comment);
  addCommentInput.value = "";
  addCommentInput.blur();
};

// 미 로그인 시 Add Comment Inpurt을 클릭하면 실행되는 함수
const handleBlurInput = (event) => {
  addCommentInput.blur();
};

// 로그인 되어있을 시 Add Comment Input을 클릭하면 실행되는 함수
const handleFocusInput = () => {
  buttonBox.classList.remove("hidden");
};

// 로그인 되어있을 시 Add Comment Form의 Cancel 버튼을 클릭하면 실행되는 함수
const handleCancelBtn = () => {
  addCommentInput.value = "";
  addCommentInput.blur();
};

function init() {
  const userId = addCommentForm.dataset.id;
  // 로그인 되어있을 시 ->
  if (userId) {
    addCommentForm.addEventListener("submit", handleSubmit);
    addCommentInput.addEventListener("click", handleFocusInput);
    cancelBtn.addEventListener("click", handleCancelBtn);
    commentBtn.addEventListener("click", handleSubmit);
  }
  // 미 로그인 시 ->
  else {
    addCommentInput.addEventListener("click", handleBlurInput);
  }
}

if (addCommentForm) {
  init();
}
