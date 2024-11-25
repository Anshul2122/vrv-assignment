import mongoose from 'mongoose'

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}`)
    } catch (e) {
        console.log(e);
        process.exit(1)
    }
}


export default connectDB