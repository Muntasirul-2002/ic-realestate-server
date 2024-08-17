import mongoose from "mongoose";

export const connectDB = async () =>{
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`Database Connected`)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}