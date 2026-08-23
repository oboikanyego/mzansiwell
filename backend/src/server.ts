import 'dotenv/config'; import mongoose from 'mongoose'; import {app} from './app.js';
const port=Number(process.env.PORT||3000);
async function start(){if(process.env.MONGODB_URI){try{await mongoose.connect(process.env.MONGODB_URI);console.log('MongoDB connected');}catch(e){console.warn('MongoDB unavailable; planner remains usable in demo mode.',e);}}app.listen(port,()=>console.log(`MzansiWell API on http://localhost:${port}`));}
start();
