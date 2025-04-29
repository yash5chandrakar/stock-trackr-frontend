import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { ProSidebar } from '../components/ProSidebar';
import { isLoggedIn } from '../common/commonMethods';
import { ButtonGroup, FormGroup, Label } from 'reactstrap';
import { Button, Input, Spin } from 'antd';
import { addTrade, sellStockFIFO, sellStockLIFO } from '../apiHelper/backendAPIHelper';
import { toast } from 'react-toastify';

export const TradePortal = () => {
    const isUserLoggedIn = isLoggedIn();
    const navigate = useNavigate()
    const [selectedOption, setSelectedOption] = useState("BUY")
    const [loading, setLoading] = useState(false)
    const [stockDetails, setStockDetails] = useState({
        stock_name: "", quantity: 0, broker_name: "", price: 0, sellType: ""
    })

    if (!isUserLoggedIn) {
        navigate("/")
    }

    const handleSubmit = async () => {
        setLoading(true)
        const callbackFunc = selectedOption === "BUY" ? addTrade : stockDetails?.sellType === "FIFO" ? sellStockFIFO : sellStockLIFO

        let payload = {
            ...stockDetails,
            type: selectedOption,
            sell_quantity: stockDetails?.quantity
        }

        await callbackFunc(payload).then((res) => {
            // console.log(res)
            toast.success("Trade Successful.")
            setLoading(false)
        }).catch((err) => {
            console.log(err)
            let errMsg = err?.message || "Something Went Wrong"
            toast.error(errMsg)
            setLoading(false)
        })
    }

    const handleInputChange = (val, type) => {
        setStockDetails((prevState) => ({
            ...prevState,
            [type]: val
        }));
    }

    const handleChange = (val) => {
        setSelectedOption(val)
    }

    return (
        <div className='dashboardOuter '>
            <ProSidebar />
            <div className='w-100 dashboardInner'>
                <div
                    className=' mt-5 w-100 '
                >
                    <h2 className='text-center mb-5'>
                        Trade Portal
                    </h2>
                    <div >
                        <div className='w-100 px-4'>
                            <ButtonGroup className='d-flex align-items-center'>
                                <Label check className={`btn btn-outline-primary ${selectedOption === 'BUY' ? 'active' : ''}`}>
                                    <Input
                                        type="radio"
                                        name="radioSwitch"
                                        value="BUY"
                                        checked={selectedOption === 'BUY'}
                                        onChange={() => handleChange('BUY')}
                                        style={{ display: 'none' }}
                                    />
                                    BUY
                                </Label>

                                <Label check className={`btn btn-outline-primary ${selectedOption === 'SELL' ? 'active' : ''}`}>
                                    <Input
                                        type="radio"
                                        name="radioSwitch"
                                        value="SELL"
                                        checked={selectedOption === 'SELL'}
                                        onChange={() => handleChange('SELL')}
                                        style={{ display: 'none' }}
                                    />
                                    SELL
                                </Label>
                            </ButtonGroup>
                            <FormGroup className='mt-4'>
                                <div className='mb-3'>
                                    <div className='mb-2 d-flex justify-content-between align-items-center'>
                                        <div>Stock Name</div>
                                        <div className='d-flex align-items-center gap-1 justify-content-end w-50'>
                                            <Input
                                                className='text-center'
                                                type="text"
                                                name="stock_name"
                                                placeholder={"Enter Stock Name"}
                                                value={stockDetails?.stock_name}
                                                onChange={(e) => handleInputChange(e.target.value, "stock_name")}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='mb-3'>
                                    <div className='mb-2 d-flex justify-content-between align-items-center'>
                                        <div>Stock Price</div>
                                        <div className='d-flex align-items-center gap-1 justify-content-end w-50'>
                                            <Input
                                                className='text-center'
                                                type="number"
                                                name="price"
                                                placeholder={"Enter Stock Price"}
                                                value={stockDetails?.price}
                                                onChange={(e) => handleInputChange(parseInt(e.target.value), "price")}
                                                min={0}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='mb-3'>
                                    <div className='mb-2 d-flex justify-content-between align-items-center'>
                                        <div>Stock Quantity</div>
                                        <div className='d-flex align-items-center gap-1 justify-content-end w-50'>
                                            <Input
                                                className='text-center'
                                                type="number"
                                                name="quantity"
                                                placeholder={"Enter Stock Quantity"}
                                                value={stockDetails?.quantity}
                                                onChange={(e) => handleInputChange(parseInt(e.target.value), "quantity")}
                                                min={0}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='mb-3'>
                                    <div className='mb-2 d-flex justify-content-between align-items-center'>
                                        <div>Stock Broker Name</div>
                                        <div className='d-flex align-items-center gap-1 justify-content-end w-50'>
                                            <Input
                                                className='text-center'
                                                type="text"
                                                name="broker_name"
                                                placeholder={"Enter Stock Broker Name"}
                                                value={stockDetails?.broker_name}
                                                onChange={(e) => handleInputChange(e.target.value, "broker_name")}
                                                min={0}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {selectedOption === "SELL" && (
                                    <div className='mb-3'>
                                        <div className='mb-2 d-flex justify-content-between align-items-center'>
                                            <div>Sell Type</div>
                                            <div className='d-flex align-items-center gap-1 justify-content-start w-50'>
                                                <ButtonGroup className='d-flex align-items-center'>
                                                    <Label check className={`btn btn-outline-primary ${stockDetails?.sellType === 'FIFO' ? 'active' : ''}`}>
                                                        <Input
                                                            type="radio"
                                                            name="radioSwitch"
                                                            value="FIFO"
                                                            checked={stockDetails?.sellType === 'FIFO'}
                                                            onChange={() => handleInputChange("FIFO", "sellType")}
                                                            style={{ display: 'none' }}
                                                        />
                                                        First In - First Out (FIFO)
                                                    </Label>

                                                    <Label check className={`btn btn-outline-primary ${stockDetails?.sellType === 'LIFO' ? 'active' : ''}`}>
                                                        <Input
                                                            type="radio"
                                                            name="radioSwitch"
                                                            value="LIFO"
                                                            checked={stockDetails?.sellType === 'LIFO'}
                                                            onChange={() => handleInputChange("LIFO", "sellType")}
                                                            style={{ display: 'none' }}
                                                        />
                                                        Last In - First Out (LIFO)
                                                    </Label>
                                                </ButtonGroup>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className='d-flex justify-content-center'>
                                    <Button color="success" onClick={() => handleSubmit()}>
                                        {loading ? <Spin /> : "Submit"}
                                    </Button>
                                </div>
                            </FormGroup>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
