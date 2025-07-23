const axios = require("axios");

exports.handler = async (event) => {
  try {
    // Get date from query parameters
    const { date } = event.queryStringParameters;
    const response = await axios.get(
      "https://api.football-data.org/v4/matches",
      {
        params: {
          competitions: "PL,SA,EC,PPL,ELC,FL1,PD,DED,BL1,CL,WC",
          date: date,
        },
        headers: {
          "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY,
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error("Proxy error:", error);
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        error: error.message,
        details: error.response?.data,
      }),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    };
  }
};
