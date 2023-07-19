const Item = require("../models/itemModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

//Initialize database
exports.initializeDb = catchAsyncErrors(async (req, res, next) => {
  const link = "https://s3.amazonaws.com/roxiler.com/product_transaction.json";
  await fetch(link)
    .then((response) => response.json())
    .then((result) => {
      Item.insertMany(result)
        .then(function () {
          console.log("Data inserted"); // Success
        })
        .catch(function (error) {
          console.log(error); // Failure
        });
    });

  res.status(200).json({
    success: true,
    message: "Database initialized successfully",
  });
});

//Api for statistics
exports.statistics = catchAsyncErrors(async (req, res, next) => {
  const { month } = req.query;
  let totalSale = 0;
  let soldItems = 0;
  let notSoldItems = 0;
  const items = await Item.find({});

  items.map((item) => {
    if (month === months[item.dateOfSale.getMonth()]) {
      if (item.sold) {
        totalSale += item.price;
        soldItems++;
      } else notSoldItems++;
    }
  });

  res.status(200).json({
    success: true,
    totalSale,
    soldItems,
    notSoldItems,
  });
});

//Api for bar chart
exports.barChart = catchAsyncErrors(async (req, res, next) => {
  const { month } = req.query;
  const barChartData = {
    "0-100": 0,
    "101-200": 0,
    "201-300": 0,
    "301-400": 0,
    "401-500": 0,
    "501-600": 0,
    "601-700": 0,
    "701-800": 0,
    "801-900": 0,
    "901-above": 0,
  };

  const items = await Item.find({});

  items.map((item) => {
    if (month === months[item.dateOfSale.getMonth()]) {
      if (item.price >= 0 && item.price <= 100) {
        barChartData["0-100"]++;
      } else if (item.price >= 101 && item.price <= 200) {
        barChartData["101-200"]++;
      } else if (item.price >= 201 && item.price <= 300) {
        barChartData["201-300"]++;
      } else if (item.price >= 301 && item.price <= 400) {
        barChartData["301-400"]++;
      } else if (item.price >= 401 && item.price <= 500) {
        barChartData["401-500"]++;
      } else if (item.price >= 501 && item.price <= 600) {
        barChartData["501-600"]++;
      } else if (item.price >= 601 && item.price <= 700) {
        barChartData["601-700"]++;
      } else if (item.price >= 701 && item.price <= 800) {
        barChartData["701-800"]++;
      } else if (item.price >= 801 && item.price <= 900) {
        barChartData["801-900"]++;
      } else if (item.price >= 901) {
        barChartData["901-above"]++;
      }
    }
  });

  res.status(200).json({
    success: true,
    barChartData,
  });
});

//Api for Pie chart
exports.pieChart = catchAsyncErrors(async (req, res, next) => {
  const { month } = req.query;
  const pieChartData = {};
  const items = await Item.find({});

  items.map((item) => {
    if (month === months[item.dateOfSale.getMonth()]) {
      if (pieChartData.hasOwnProperty(item.category)) {
        pieChartData[item.category]++;
      } else pieChartData[item.category] = 1;
    }
  });

  res.status(200).json({
    success: true,
    message: "Pie chart data (category: Items)",
    pieChartData,
  });
});

//Api to combined the responses
exports.combined = catchAsyncErrors(async (req, res, next) => {
  const { month } = req.query;
  const array = ["statistics", "barchart", "piechart"];

  const promises = array.map(resp =>
    fetch(`http://localhost:4000/api/v1/items/${resp}?month=${month}`)
      .then(newres => newres.json())
  );

  const combinedData = await Promise.all(promises);

  res.status(200).json({
    success: true,
    combinedData,
  });
});

