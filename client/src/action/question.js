import * as api from "../api";
import { showNotification } from "../utils/notify";

// Fetch all questions
export const fetchallquestion = () => async (dispatch) => {
  try {
    const { data } = await api.getallquestions();
    dispatch({ type: "FETCH_ALL_QUESTIONS", payload: data });
  } catch (error) {
    console.log(error);
    // Optionally: showNotification("Error", "Failed to fetch questions.");
    return;
  }
};

// Ask a question
export const askquestion = (questiondata) => async (dispatch) => {
  try {
    const { data } = await api.postquestion(questiondata);
    dispatch({ type: "ASK_QUESTION", payload: data });
    dispatch(fetchallquestion());
  } catch (error) {
    console.log(error);
    // Optionally: showNotification("Error", "Failed to ask question.");
    return;
  }
};

// Post an answer
export const postanswer = (answerdata) => async (dispatch, getState) => {
  try {
    const { id, noofanswers, answerbody, useranswered, userid } = answerdata;
    const { data } = await api.postanswer(id, noofanswers, answerbody, useranswered, userid);
    dispatch({ type: "POST_ANSWER", payload: data });
    dispatch(fetchallquestion());

    // Notify the question owner if notifications are enabled and someone else answered
    const state = getState();
    const questions = state.questionreducer.data || [];
    const question = questions.find(q => q._id === id);
    if (
      question &&
      question.userid !== state.currentuserreducer?.result?._id && // Only notify if not self
      question.notificationEnabled !== false // Owner has notifications enabled
    ) {
      showNotification("New Answer", "Someone answered your question!");
    }
  } catch (error) {
    console.log(error);
    // Optionally: showNotification("Error", "Failed to post answer.");
    return;
  }
};

// Vote a question
export const votequestion = (id, value) => async (dispatch, getState) => {
  try {
    await api.votequestion(id, value);
    dispatch(fetchallquestion());

    // Notify the question owner if notifications are enabled and someone else upvoted
    const state = getState();
    const questions = state.questionreducer.data || [];
    const question = questions.find(q => q._id === id);
    if (
      question &&
      question.userid !== state.currentuserreducer?.result?._id && // Only notify if not self
      question.notificationEnabled !== false // Owner has notifications enabled
    ) {
      showNotification("Upvote", "Someone upvoted your question!");
    }
  } catch (error) {
    console.log(error);
    // Optionally: showNotification("Error", "Failed to vote question.");
    return;
  }
};

// Delete a question
export const deletequestion = (id) => async (dispatch) => {
  try {
    await api.deletequestion(id);
    dispatch(fetchallquestion());
  } catch (error) {
    console.log(error);
    // Optionally: showNotification("Error", "Failed to delete question.");
    return;
  }
};

// Delete an answer
export const deleteanswer = (id, answerid, noofanswers) => async (dispatch) => {
  try {
    await api.deleteanswer(id, answerid, noofanswers);
    dispatch(fetchallquestion());
  } catch (error) {
    console.log(error);
    // Optionally: showNotification("Error", "Failed to delete answer.");
    return;
  }
};