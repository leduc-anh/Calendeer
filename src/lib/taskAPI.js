import axiosClient from "./axiosClient";

const taskAPI = {
  getAll: () => axiosClient.get("/tasks"),
  getById: (id) => axiosClient.get(`/tasks/${id}`),
  create: (data) => axiosClient.post("/tasks", data),
  update: (id, data) => axiosClient.put(`/tasks/${id}`, data),
  delete: (id) => axiosClient.delete(`/tasks/${id}`)
};
export default taskAPI;
