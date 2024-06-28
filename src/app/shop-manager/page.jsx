"use client";
import { callAPI } from "@/utils/api-caller";
import { getUser, isLogined, setToken, setUser } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import 'chart.js/auto';


const ShopManager = () => {
    const router = useRouter();
    const [user, setUserState] = useState(getUser())


    const [revenue, setRevenue] = useState(0)
    const [order, setOrder] = useState(0)
    const [product, setProduct] = useState(0)
    const [cate, setCate] = useState(0)
    const [json, setJson] = useState();

    useEffect(() => {
        if (!isLogined()){
            router.replace("/login")
        }
        if (getUser()?.role?.name !== "ShopManager")
            {
                router.replace("/")
            }
       
        getRevenue();
        getOrder();
        getProduct();
        getCate();
        getJsonData();

    }, [])
    const getRevenue = async () => {
        try {
            const res = await callAPI("/get-revenue", "GET")
            console.log(res.data)
            setRevenue(res.data.revenue)
        } catch (error) {

        }
    }
    const getOrder = async () => {
        try {
            const res = await callAPI("/orders", "GET")
            console.log(res.data.meta)
            setOrder(res.data.meta.pagination.total)
        } catch (error) {

        }
    }
    const getProduct = async () => {
        try {
            const res = await callAPI("/products", "GET")
            console.log(res.data.meta)
            setProduct(res.data.meta.pagination.total)
        } catch (error) {

        }
    }
    const getCate = async () => {
        try {
            const res = await callAPI("/categories", "GET")
            console.log(res.data.meta)
            setCate(res.data.meta.pagination.total)
        } catch (error) {

        }
    }
    const getJsonData = async () => {
        try {
            const res = await callAPI("/orders?fields[0]=createdAt&fields[1]=totalPrice", "GET");
            console.log(res.data);
            setJson(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const processJsonData = (jsonData) => {
        const dailyRevenue = {};

        jsonData.forEach(item => {
            const date = item.attributes.createdAt.split('T')[0];
            const price = parseFloat(item.attributes.totalPrice);

            if (dailyRevenue[date]) {
                dailyRevenue[date] += price;
            } else {
                dailyRevenue[date] = price;
            }
        });

        const labels = Object.keys(dailyRevenue);
        const datas = Object.values(dailyRevenue);

        return { labels, datas };
    };
    const { labels, datas } = json ? processJsonData(json) : { labels: [], datas: [] };


    const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), {
        ssr: false,
    });
    const data = {
        labels: labels,
        datasets: [
          {
            label: 'Daily Revenue',
            data: datas,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      };
      const LineChart = () => {
        return (
          <div style={{ width: '900px', height: '900px' }}>
            <Line data={data} />
          </div>
        );
      };
      const logout = () => {
        setToken("")
        setUser(null)
        setUserState(null)
        router.replace("/")
    }
    return (
        <div className="w-full h-full bg-custom-beige-2">
            <div className="ml-80">
            <button onClick={() => { logout() }}  className="ml-80 pl-80 pr-5 pt-10 ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-8 ml-80">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                    </svg>

                </button>
            </div>

        <div className="flex grid grid-flow-col auto-cols-max px-20 py-20 bg-custom-beige-2 space-x-20">
            <div className="p-10 text-2xl font-bold text-center text-white bg-custom-yellow border border-custom-brown">
                Total Revenue
                <br />
                $ {revenue}
            </div>
            <div className="p-10 text-2xl font-bold text-center text-white bg-custom-yellow border border-custom-brown">
                Total Order
                <br />
                {order}
            </div>
            <div className="p-10 text-2xl font-bold text-center text-white bg-custom-yellow border border-custom-brown">
                Total Product
                <br />
                {product}
            </div>
            <div className="p-10 text-2xl font-bold text-center text-white bg-custom-yellow border border-custom-brown">
                Total Category
                <br />
                {cate}
            </div>
        </div>
        <div className="pl-40"> {LineChart()}</div>
            
        
        </div>
    );
};
export default ShopManager;