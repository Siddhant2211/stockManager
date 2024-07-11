import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";


export async function GET(request){
   
    const query = request.nextUrl.searchParams.get("query")
    
    const uri = "mongodb+srv://atul_22:mXdAyfCINAaIw5nV@stockman.h1mfcf0.mongodb.net/?retryWrites=true&w=majority&appName=stockMan"
    
    const client = new MongoClient(uri)
    
    
        try{
            const database = client.db('stock')
            const inventory = database.collection('inventory')
            
            
            const products = await inventory.aggregate([{$match: {$or: [{slug: {$regex: query, $options: "i"}},]}}]).toArray()
            return NextResponse.json({success: true, products})
        }
        finally{
            await client.close()
        }
    
    }

