import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { CloudWatchClient, GetMetricStatisticsCommand } from "@aws-sdk/client-cloudwatch";
import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";


dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const cloudwatchClient = new CloudWatchClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const ec2Client = new EC2Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function getInstanceIdFromIp(ipAddress) {
  const params = {
    Filters: [{ Name: "private-ip-address", Values: [ipAddress] }],
  };

  try {
    const command = new DescribeInstancesCommand(params);
    const data = await ec2Client.send(command);

    if (data.Reservations.length > 0) {
      return data.Reservations[0].Instances[0].InstanceId;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching instance ID:", error);
    return null;
  }
}

app.post("/api/data", async (req, res) => {
  const { time_period, period, ip } = req.body;
  if (!ip) {
    return res.status(400).json({ error: "IP address is required" });
  }

  const instanceId = await getInstanceIdFromIp(ip);
  if (!instanceId) {
    return res.status(404).json({ error: "Instance ID not found for this IP" });
  }
  const MS_IN_HOUR = 3600 * 1000;
  const endTime = new Date(Date.now()); 
  const startTime = new Date(Date.now() - parseInt(time_period, 10) * MS_IN_HOUR);
  const params = {
    Namespace: "AWS/EC2",
    MetricName: "CPUUtilization",
    Period: parseInt(period, 10) || 3600,
    Statistics: ["Maximum"],
    Dimensions: [{ Name: "InstanceId", Value: instanceId }],
    StartTime: startTime,
    EndTime: endTime,
  };

  try {
    const command = new GetMetricStatisticsCommand(params);
    const data = await cloudwatchClient.send(command);
    res.json({ message: "Data received", metrics: data.Datapoints });
  } catch (error) {
    console.error("Error fetching AWS metrics:", error);
    res.status(500).json({ error: "Failed to fetch AWS data" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
