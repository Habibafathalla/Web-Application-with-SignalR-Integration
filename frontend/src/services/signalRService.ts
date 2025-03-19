import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5000/processHub") // Ensure this matches your backend URL
  .withAutomaticReconnect()
  .build();

export const startSignalR = async (onProgressUpdate: (message: string) => void) => {
  connection.on("ReceiveProgress", onProgressUpdate);
  try {
    await connection.start();
  } catch (err) {
    console.error("Error connecting to SignalR:", err);
  }
};

export default connection;
