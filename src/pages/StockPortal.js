import React, { useEffect, useRef, useState } from 'react'
import { ProSidebar } from '../components/ProSidebar';
import { getUserSavedData } from '../common/commonMethods';
import { useNavigate } from 'react-router-dom';
import delete_icon from '../assets/delete_icon.png';
import arrow_icon from '../assets/arrow_icon.png';
import { toast } from 'react-toastify';
import { Spin, Table, Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import { bulkTrade, getAllLots, getAllTrades } from '../apiHelper/backendAPIHelper';
import Papa from 'papaparse';

export const StockPortal = () => {
    const navigate = useNavigate()
    const [tradeList, setTradeList] = useState([])
    const [lotList, setLotList] = useState([])
    const [loading, setLoading] = useState(false)
    const inputRef = useRef()

    const tradeColumns = [
        {
            title: 'Trade ID',
            dataIndex: 'trade_id',
            key: 'trade_id',
            ellipsis: true,
        },
        {
            title: 'Stock Name',
            dataIndex: 'stock_name',
            key: 'stock_name',
        },
        {
            title: 'Trade Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Broker Name',
            dataIndex: 'broker_name',
            key: 'broker_name',
            render: (text) => text || 'N/A',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (text) => `₹ ${text.toFixed(2)}`,
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (text) => `₹ ${text.toFixed(2)}`,
        },
        {
            title: 'Timestamp',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (text) => new Date(text).toLocaleString(),
        },
    ];

    const lotColumns = [
        {
            title: 'Lot ID',
            dataIndex: 'lot_id',
            key: 'lot_id',
            ellipsis: true,
        },
        {
            title: 'Trade ID',
            dataIndex: 'trade_id',
            key: 'trade_id',
            ellipsis: true,
        },
        {
            title: 'Stock Name',
            dataIndex: 'stock_name',
            key: 'stock_name',
        },
        {
            title: 'Lot Quantity',
            dataIndex: 'lot_quantity',
            key: 'lot_quantity',
        },
        {
            title: 'Realized Quantity',
            dataIndex: 'realized_quantity',
            key: 'realized_quantity',
        },
        {
            title: 'Realized Trade ID',
            dataIndex: 'realized_trade_id',
            key: 'realized_trade_id',
            render: (text) => text || 'N/A',
        },
        {
            title: 'Lot Status',
            dataIndex: 'lot_status',
            key: 'lot_status',
        },
    ];

    const handleClear = () => {
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const fetchTradeList = async () => {
        await getAllTrades().then((res) => {
            setTradeList(res?.data || [])
        }).catch(err => {
            // let errMsg = err?.message || "Something Went Wrong"
            // toast.error(errMsg)
        })
    }

    const fetchLotList = async () => {
        await getAllLots().then((res) => {
            setLotList(res?.data || [])
        }).catch(err => {
            // let errMsg = err?.message || "Something Went Wrong"
            // toast.error(errMsg)
        })
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    // console.log('Parsed CSV:', results.data);
                    handleSubmit(results?.data || [])
                    handleClear()
                },
            });
        }
    };

    const handleDownloadSample = () => {
        const link = document.createElement('a');
        link.href = '/sampleCSV.csv'; // Public path to file
        link.download = 'sampleCSV.csv';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const handleSubmit = async (tradeItems) => {
        if (!tradeItems?.length) {
            toast.error("Please atleast one item!")
            return
        }
        tradeItems = tradeItems?.map((el) => {
            el.price = parseInt(el?.price)
            el.quantity = parseInt(el?.quantity)
            return el
        })
        setLoading(true)
        await bulkTrade({
            tradeItems: tradeItems
        }).then((res) => {
            let successMsg = res?.message || "Submission Successful"
            toast.success(successMsg)
            setLoading(false)
            fetchTradeList()
            fetchLotList()
        }).catch(err => {
            let errMsg = err?.message || "Something Went Wrong"
            toast.error(errMsg)
            setLoading(false)
        })
    }

    useEffect(() => {
        fetchTradeList()
        fetchLotList()
    }, [])


    return (
        <div className='dashboardOuter'>
            <ProSidebar />
            <div className='dashboardInner mx-5'>
                <Tabs defaultActiveKey="1">
                    <TabPane tab={<>Trades</>} key="1">
                        <div >
                            <div className='d-flex justify-content-between'>
                                <h4>Trade List</h4>
                                <div >
                                    <label className='btn btn-secondary mx-3' onClick={() => handleDownloadSample()}>
                                        Sample CSV
                                    </label>
                                    <label className='btn btn-primary'>
                                        {loading ? <Spin /> : "Bulk Upload"}
                                        <input disabled={loading} type="file" accept=".csv" style={{ display: 'none' }} ref={inputRef} onChange={handleFileChange} />
                                    </label>
                                </div>
                            </div>

                            <Table dataSource={tradeList} columns={tradeColumns} />
                        </div>
                    </TabPane>
                    <TabPane tab={<>Lots</>} key="2">
                        <div>
                            <h4>Lot List</h4>
                            <Table dataSource={lotList} columns={lotColumns} />
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    )
}
