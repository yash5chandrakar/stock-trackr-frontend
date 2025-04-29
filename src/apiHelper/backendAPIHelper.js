import axios from 'axios';
import * as URL from '../apiHelper/urlHelper'

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || '', // Optional: use env variable
    headers: {
        'Content-Type': 'application/json',
    },
    "proxy": "http://localhost:3000"
});

export const getRequest = async (url, config = {}) => {
    try {
        const response = await axiosInstance.get(url, config);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const postRequest = async (url, data, config = {}) => {
    try {
        const response = await axiosInstance.post(url, data, config);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const putRequest = async (url, data, config = {}) => {
    try {
        const response = await axiosInstance.put(url, data, config);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const deleteRequest = async (url, config = {}) => {
    try {
        const response = await axiosInstance.delete(url, config);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

const handleError = (error) => {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || error;
};


export const addTrade = (data) => postRequest(URL.ADD_TRADE, data);

export const updateTrade = (data) => putRequest(URL.UPDATE_TRADE, data);

export const getTrade = (trade_id) => postRequest(URL.GET_TRADE, { trade_id });

export const getAllTrades = () => getRequest(URL.GET_ALL_TRADES);

export const deleteTrade = (id) => deleteRequest(URL.DELETE_TRADE(id));

export const bulkTrade = (tradeItems) => postRequest(URL.BULK_TRADE, tradeItems);

export const sellStockFIFO = (data) => postRequest(URL.SELL_STOCK_FIFO, data);

export const sellStockLIFO = (data) => postRequest(URL.SELL_STOCK_LIFO, data);

export const getLotById = (lot_id) => getRequest(URL.GET_LOT_BY_ID(lot_id));

export const getAllLots = () => getRequest(URL.GET_ALL_LOTS);