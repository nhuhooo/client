const OrderItem = ({products, totalPrice})=> {
    return (
        <div className="justify-between mb-6 rounded-lg bg-white p-6   sm:justify-start border border-custom-brown">

            <div className="">
                {
                    products.map((product, index)=>{
                        return (
                            <div key={index + product.name} className="grid grid-flow-col auto-cols-max">
                                    <h2 className="text-lg text-gray-900">{product.name}
                                        <h1 className="whitespace-pre">{product.amount}x${product.price}                                                            ${product.price*product.amount}</h1>

                                    </h2>     
                                    </div>
                        )
                    })
                }
                
            </div>
            <div className="text-lg font-semibold">Total: ${totalPrice}</div>

        </div>
    )
}
export default OrderItem;