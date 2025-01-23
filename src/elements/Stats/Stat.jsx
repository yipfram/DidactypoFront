import api from "../../api";

const Stat = async ({ pseudo, type }) => {
  try {
    const response = await api.get("/stat/", {
      params: {
        pseudo_utilisateur: pseudo,
        type_stat: type,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
}

export default Stat;