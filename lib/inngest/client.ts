import { Inngest } from "inngest";

// Force development mode allowing SDK execution bypassing Cloud key validations natively if not wrapped by CLI
if (process.env.NODE_ENV === "development") {
  process.env.INNGEST_DEV = "1";
}

// Establish a durable SDK client context locally isolating process executions
export const inngest = new Inngest({ 
  id: "mapreview-engine",
  eventKey: process.env.INNGEST_EVENT_KEY || "local"
});
