import express from "express"
import cors from "cors"
import clientsRoutes from "./routes/clients.js"
import vehiclesRoutes from "./routes/vehicles.js"
import inventoryRoutes from "./routes/inventory.js"
import ordersRoutes from "./routes/orders.js"

const app = express()
app.use(cors())
app.use(express.json())

app.use("/clients", clientsRoutes);
app.use("/vehicles", vehiclesRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/orders", ordersRoutes);

app.listen(8800, ()=>{
    console.log("Connected to backend")
})