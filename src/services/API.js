import axios from 'axios';

const API_URL = 'https://server-five-rho-19.vercel.app/objetos';

// Obtener todos los objetos
export const getObjetos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener objetos:', error);
    throw error;
  }
};

// Crear nuevo objeto
export const createObjeto = async (objeto) => {
  try {
    const response = await axios.post(API_URL, objeto);
    return response.data;
  } catch (error) {
    console.error('Error al crear objeto:', error);
    throw error;
  }
};

// Actualizar objeto existente
export const updateObjeto = async (id, objeto) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, objeto);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar objeto:', error);
    throw error;
  }
};

// Eliminar objeto
export const deleteObjeto = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar objeto:', error);
    throw error;
  }
};
