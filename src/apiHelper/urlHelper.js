// Trade Routes
export const ADD_TRADE = "/api/trades/addtrade";
export const UPDATE_TRADE = "/api/trades/updatetrade";
export const GET_TRADE = "/api/trades/gettrade";
export const GET_ALL_TRADES = "/api/trades/getalltrades";
export const DELETE_TRADE = (id) => `/api/trades/deletetrade/${id}`;
export const BULK_TRADE = "/api/trades/bulktrade";

// Lot Operations
export const SELL_STOCK_FIFO = "/api/lot/sell/fifo";
export const SELL_STOCK_LIFO = "/api/lot/sell/lifo";
export const GET_LOT_BY_ID = (lot_id) => `/api/lot/getlot/${lot_id}`;
export const GET_ALL_LOTS = "/api/lot/getlots";
