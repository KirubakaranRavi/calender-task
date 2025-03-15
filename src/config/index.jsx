const config = {
  production: {
    url: "",
    apiUrl: "",
    AWS_URL: "",
  },
  staging: {
    url: "http://localhost:3000/",
    apiUrl: "https://ynx1mx5f45.execute-api.us-east-1.amazonaws.com/staging/", // Development API URL
    AWS_URL: "https://evalia-s3-bucket.s3.us-east-1.amazonaws.com/", // Same for AWS endpoint
    AWS_REGION: "us-east-1",
    ACCESS_KEY_ID: process.env.REACT_APP_ACCESS_KEY,
    SECRET_ACCESS_KEY: process.env.REACT_APP_SECRET_ACCESS_KEY,
    bucketName: "evalia-s3-bucket",
    identityPoolId: "us-east-1:5e3aff5a-2fb2-4b1f-bcbc-50697fdeba29",
  },
  demoDevelop: {
    url: "http://localhost:3000/",
    apiUrl:
      "https://sk7haoxkm2.execute-api.us-east-1.amazonaws.com/demo-develop/",
    AWS_URL: "https://evalia-bucket.s3.us-east-1.amazonaws.com/",
    AWS_REGION: "us-east-1",
    ACCESS_KEY_ID: process.env.REACT_APP_ACCESS_KEY,
    SECRET_ACCESS_KEY: process.env.REACT_APP_SECRET_ACCESS_KEY,
    bucketName: "evalia-bucket",
    identityPoolId: "us-east-1:f0cd7fc5-4658-4a5d-afa5-9e4c2d6897b8",
  },
  development: {
    url: "http://localhost:3000/",
    apiUrl: "https://ikr9gbfqba.execute-api.us-east-1.amazonaws.com/dev/", // Development API URL
    AWS_URL: "https://evalia-bucket.s3.us-east-1.amazonaws.com/", // Same for AWS endpoint
    AWS_REGION: "us-east-1",
    ACCESS_KEY_ID: process.env.REACT_APP_ACCESS_KEY,
    SECRET_ACCESS_KEY: process.env.REACT_APP_SECRET_ACCESS_KEY,
    bucketName: "evalia-bucket",
    identityPoolId: "us-east-1:f0cd7fc5-4658-4a5d-afa5-9e4c2d6897b8",
  },
};

// Current environment setting (0 = development, 1 = demoDevelop, 2 = staging, 3 = production)
export const env = 1;

// Map environment numbers to environment names
const envMapping = ["development", "demoDevelop", "staging", "production"];

// Resolve the current environment configuration
const currentEnv = config[envMapping[env]] || {};

// Create the host configuration with defaults and fallbacks
const hostConfig = {
  WEB_URL: process.env.REACT_APP_WEB_URL || currentEnv.url || "",
  API_URL: currentEnv.apiUrl || "",
  AWS_URL: currentEnv.AWS_URL || "",
  AWS_REGION: currentEnv.AWS_REGION || "us-east-1",
  ACCESS_KEY_ID:
    currentEnv.ACCESS_KEY_ID || process.env.REACT_APP_ACCESS_KEY || "",
  SECRET_ACCESS_KEY:
    currentEnv.SECRET_ACCESS_KEY ||
    process.env.REACT_APP_SECRET_ACCESS_KEY ||
    "",
  S3_Bucket: currentEnv.bucketName || "",
  IdentityPoolId: currentEnv.identityPoolId || "", // Update with your actual Identity Pool ID
};

// Export the configuration object
export { hostConfig };
