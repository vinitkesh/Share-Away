import File from '../models/file.js';
import os from 'os';  // Import the 'os' module to get the local IP address
import dotenv from 'dotenv';

dotenv.config();

// Function to get local IPv4 address of the machine
const getLocalIP = () => {
    const networkInterfaces = os.networkInterfaces();
    let localIP = 'localhost';  // Default fallback

    for (const interfaceName in networkInterfaces) {
        const interfaces = networkInterfaces[interfaceName];
        for (const iface of interfaces) {
            if (iface.family === 'IPv4' && !iface.internal) {
                localIP = iface.address; // Get local IPv4 address
                break;
            }
        }
    }

    return localIP;
}

export const uploadImage = async (request, response) => {
    const fileObj = {
        path: request.file.path,
        name: request.file.originalname,
    }
    
    try {
        const file = await File.create(fileObj);

        // Get local IP address dynamically
        const localIP = getLocalIP();

        // Send the URL with the local IP instead of localhost
        response.status(200).json({
            path: `http://${localIP}:${process.env.PORT}/file/${file._id}`
        });
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ error: error.message });
    }
}

export const getImage = async (request, response) => {
    try {   
        const file = await File.findById(request.params.fileId);
        
        file.downloadCount++;

        await file.save();

        response.download(file.path, file.name);
    } catch (error) {
        console.error(error.message);
        response.status(500).json({ msg: error.message });
    }
}
