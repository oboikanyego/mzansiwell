import 'dotenv/config'; import mongoose from 'mongoose'; import {app} from './app.js';
const port=Number(process.env.PORT||3000);
async function start(){if(process.env.MONGODB_URI){try{await mongoose.connect(process.env.MONGODB_URI,{serverSelectionTimeoutMS:10000});console.log('MongoDB connected');}catch(e){console.warn('MongoDB unavailable; planner remains usable in demo mode.',e);}}const server=app.listen(port,'0.0.0.0',()=>console.log(`EatHealthy API listening on port ${port}`));const shutdown=()=>server.close(()=>mongoose.disconnect().finally(()=>process.exit(0)));process.on('SIGTERM',shutdown);process.on('SIGINT',shutdown);}
start().catch(error=>{console.error('EatHealthy API failed to start.',error);process.exit(1);});
