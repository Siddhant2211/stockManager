'use client'

import Header from "@/components/Header";
import { useState, useEffect } from "react";

export default function Home() {

const [productForm, setProductForm] = useState({})
const [products, setProducts] = useState([])
const [alert, setAlert] = useState("")
const [query, setQuery] = useState("")
const [loading, setLoading] = useState(false)
const [loadingAction, setLoadingAction] = useState(false)
const [dropdown, setDropdown] = useState([])


useEffect(() => {
  const fetchProducts = async () => {
    const response = await fetch('/api/product')
    let rjson = await response.json()
    setProducts(rjson.products)
  }
  fetchProducts()
}, [])



const buttonAction = async (action, slug, initialQuantity) => {
  let index = products.findIndex((item) => item.slug == slug)
  let newProducts = JSON.parse(JSON.stringify(products))
  if(action == "plus"){
    newProducts [index].quantity = parseInt(initialQuantity) + 1
  }
  else{
    newProducts [index].quantity = parseInt(initialQuantity) - 1
  }
  setProducts(newProducts)




  let indexDrop = dropdown.findIndex((item) => item.slug == slug)
  let newDropdown = JSON.parse(JSON.stringify(dropdown))
  if(action == "plus"){
    newDropdown [indexDrop].quantity = parseInt(initialQuantity) + 1
  }
  else{
    newDropdown [indexDrop].quantity = parseInt(initialQuantity) - 1
  }
  setDropdown(newDropdown)





  setLoadingAction(true)
  const response = await fetch('/api/action', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({action, slug, initialQuantity})
  })
  let r = await response.json()
  console.log(r)
  setLoadingAction(false)
}



const addProduct = async (e) => {

 

  try{
    const response = await fetch('/api/product', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(productForm)
    })


    if(response.ok){
      console.log("Product added successfully")
      setAlert("Your Product has been added!")
      setProductForm({})
    }
    else{
      console.error('Error adding product')
    }
  }
  catch(error){
    console.error('Error: ', error);
  }


  const response = await fetch('/api/product')
  let rjson = await response.json()
  setProducts(rjson.products)

  e.preventDefault()
}



const handleChange = (e) => {
  setProductForm({...productForm, [e.target.name]: e.target.value})
}


const onDropdownEdit = async (e) => {
  let value = e.target.value
  setQuery(value)
  if(value.length > 3){
    setLoading(true)
    setDropdown([])
    const respone = await fetch('/api/search?query=' + query)
    let rjson = await respone.json()
    setDropdown(rjson.products)
    setLoading(false)
  }
  else{
    setDropdown([])
  }
}


  return (
    <>
    <Header/>
    <div className="container mx-auto my-8">
      <div className="text-green-800 text-center">{alert}</div>
    <h1 className="text-3xl font-semibold mb-6">Search a Product</h1>
      <div className="flex mb-2">
        <input onChange={onDropdownEdit} type="text" placeholder="Enter a product name" className="flex-1 border border-gray-300 px-4 py-2 rounded-l-md"/>
        
        <select className="border border-gray-300 px-4 py-2 rounded-r-md">
        <option value="">All</option>
        <option value="category1">Category 1</option>
        <option value="category2">Category 2</option>
        </select>
      </div>


      {loading && <div className="flex justify-center items-center"><svg fill="#000000" height="180px" width="180px" version="1.1" id="Layer_1" viewBox="0 0 330 330">
        <circle className="spinner-path" cx="25" cy="25" r="20" fill="none" strokeWidth="4" stroke="#000" strokeDasharray="31.415, 31.415" strokeDashoffset="0">
          <animate attributeName="strokeDashoffset" repeatCount="indefinite" dur="1s" from="0" to="62.83"/>
          <animate attributeName="strokeDasharray" repeatCount="indefinite" dur="1s" values="31.415, 31.415; 0, 62.83; 31.415, 31.415"/>
        </circle>
      </svg></div>
}


<div className="dropContainer absolute w-[72vw] border-1 bg-purple-100 rounded-md">
      {dropdown.map(item => {
        return <div key={item.slug} className="container flex justify-between my-1 p-2 border-b-2">
          <span className="slug">{item.slug} ({item.quantity} available for ₹{item.price})</span>
          <div className="mx-5">
          <button onClick={() => {buttonAction("minus", item.slug, item.quantity)}} disabled={loadingAction} className="subtract cursor-pointer inline-block px-3 py-1 bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200">-</button>
          <span className="quantity inline-block w-3 mx-3">{item.quantity}</span>
          <button onClick={() => {buttonAction("plus", item.slug, item.quantity)}} disabled={loadingAction} className="add cursor-pointer inline-block px-3 py-1 bg-purple-500 text-white font-semibold rounded-lg shadow-md disabled:bg-purple-200">+</button>
          </div>
          
          </div>
      })}
      </div>
      </div>


    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-semibold mb-6">Add a Product</h1>
      
      
      <form>
        <div className="mb-4">
          <label htmlFor="productName" className="block mb-2">Product Slug</label>
          <input value={productForm?.slug || ""} name="slug" onChange={handleChange} type="text" id="productName" className="w-full border border-gray-300 px-4 py-2"/>
        </div>
        
        <div className="mb-4">
          <label htmlFor="quantity" className="block mb-2">Quantity</label>
          <input value={productForm?.quantity || ""} name="quantity" onChange={handleChange} type="number" id="quantity" className="w-full border border-gray-300 px-4 py-2"/>
        </div>

        <div className="mb-4"> 
          <label htmlFor="price" className="block mb-2">Price</label>
          <input value={productForm?.price || ""} name="price" onChange={handleChange} type="number" id="price" className="w-full border border-gray-300 px-4 py-2"/>
        </div>
        
        <button onClick={addProduct} type="submit" className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg">Add Product</button>

      </form>
    </div>


    <div className="container my-8 mx-auto">  

  
      <h1 className="text-3xl font-semibold mb-6">Display Current Stock</h1>

      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Product Name</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {products && products.map(product => {
            return <tr key={product.slug}>
            <td className="border px-4 py-2">{product.slug}</td>
            <td className="border px-4 py-2">{product.quantity}</td>
            <td className="border px-4 py-2">₹{product.price}</td>
          </tr>
          })}
  
        </tbody>
      </table>


      
    </div>
    </>
  );
}


