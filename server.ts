import cluster from 'cluster';
import os from 'os';
import app from './app';  // Import the express app
import { connectDatabase } from './config/database';

const totalCpus = os.cpus().length;
const port = parseInt(process.env.PORT as string, 10) || 6000;

process.on('uncaughtException', (err: Error) => {
    console.error('Uncaught Exception:', err);
    process.exit(1); // Exit the process to avoid undefined states
});

(async () => {
    try {
        console.log('Connecting to the database...');
        await connectDatabase();
        console.log('Database connected successfully');

        if (cluster.isPrimary) {
            console.log(`Master process ${process.pid} is running`);

            for (let i = 0; i < totalCpus; i++) {
                cluster.fork();
            }

            cluster.on('exit', (worker, code, signal) => {
                console.log(`Worker ${worker.process.pid} died. Forking a new worker...`);
                cluster.fork();
            });
        } else {
            // Worker processes share the same server
            app.listen(port, () => {
                console.log(`Worker ${process.pid} started. Server is running on port ${port}`);
            });
        }
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    }
})();

process.on('unhandledRejection', (err: Error) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1); // Exit the process to avoid undefined states
});
