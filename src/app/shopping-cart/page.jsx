"use client"
import { useAppContext } from "@/components/context"
import ShoppingCartItem from "@/components/shopping-cart-item"
import { callAPI } from "@/utils/api-caller"
import Link from "next/link"
import { useEffect, useState } from "react"
const URL_SERVER = process.env.NEXT_PUBLIC_BACKEND_SERVER_MEDIA
const ShoppingCartPage = () => {
    const { shoppingCart, setShoppingCart } = useAppContext()
    const [totalPrice, setTotalPrice] = useState(0)
    const [address, setAddress] = useState("")
    const [phone, setPhone] = useState("")
    console.log(shoppingCart)
    useEffect(() => {
        calcTotalPrice();
    }, [shoppingCart])
    const calcTotalPrice = () => {
        var sum = 0
        for (var i = 0; i < shoppingCart.length; i++) {
            sum += +shoppingCart[i].price * +shoppingCart[i].amount
        }
        console.log(sum)
        setTotalPrice(sum)
    }

    const add = async (productId) => {
        try {
            const res = await callAPI("/add-to-shopping-cart", "POST", { productId, amount: 1 })
            console.log(res)
            setShoppingCart(res.data)
            calcTotalPrice()
        } catch (error) {

        }
    }
    const decrease = async (productId) => {
        try {
            const res = await callAPI("/add-to-shopping-cart", "POST", { productId, amount: -1 })
            console.log(res)
            setShoppingCart(res.data)
            calcTotalPrice()
        } catch (error) {

        }
    }
    const remove = async (productId, amount) => {
        try {
            const res = await callAPI("/add-to-shopping-cart", "POST", { productId, amount })
            console.log(res)
            setShoppingCart(res.data)
        } catch (error) {

        }
    }
    const onCheckout = async()=>{
        try {
            const data = {
                address,
                phone
            }
            const res = await callAPI("/check-out", "POST", data)
            console.log(res.data)
            setShoppingCart([])
        } catch (error) {
            console.log(error)
        }
        
    }
    return (
        <div className="h-screen w-screen bg-[rgb(251,249,247)] pt-20">
            <h1 className="mb-10 pt-20 text-center text-2xl font-bold">My Cart</h1>
            <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
                <div className="rounded-lg md:w-2/3">
                    {
                        shoppingCart.map((val, index) => {
                            return (
                                <ShoppingCartItem
                                    productId={val.id}
                                    add={add}
                                    decrease={decrease}
                                    remove={remove}
                                    key={index}
                                    image={URL_SERVER + val.image[0].url}
                                    productName={val.name}
                                    price={val.price * val.amount}
                                    category={val.category.name}
                                    amount={val.amount}
                                />
                            )
                        })
                    }


                </div>
                <div className="mt-6 h-full rounded-lg border bg-white p-6  md:mt-0 md:w-1/3">
                    <div>
                        <label for="first_name" className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">Address</label>
                        <input type="text" id="first_name" value={address} onChange={e=>setAddress(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Address" required />
                    </div>
                    <div>
                        <label for="last_name" className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">Phone</label>
                        <input type="text" id="last_name" value={phone} onChange={e=>setPhone(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Phone number" required />
                    </div>
                    <hr className="my-4" />
                    <div className="flex justify-between">
                        <p className="text-lg font-bold">Total</p>
                        <div className="">
                            <p className="mb-1 text-lg font-bold">${totalPrice}</p>
                            <p className="text-sm text-gray-700">including VAT</p>
                        </div>
                    </div>
                    <button onClick={()=>onCheckout()} className=" flex justify-center items-center h-12 w-60 ml-5 my-3 font-semibold border bg-[rgba(134,111,70,0.8)] text-white border-white hover:bg-transparent hover:border-custom-brown hover:text-custom-brown   transition duration-300 ease-in-out">
                    Check out</button>
                </div>
            </div>
        </div>
    )
}
export default ShoppingCartPage