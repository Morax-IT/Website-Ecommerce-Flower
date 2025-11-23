import api from "../api/axios";

export const getReviewByProductId = async (id) => {
  const res = await api.get(`/review/${id}`);
  return res.data;
};

export const createReview = async (reviewData) => {
  const res = await api.post("/review", reviewData);
  return res.data;
};

export const updateReview = async (id, reviewData) => {
  const res = await api.put(`/review/${id}`, reviewData);
  return res.data;
};

export const deleteReview = async (id) => {
  const res = await api.delete(`/review/${id}`);
  return res.data;
};
