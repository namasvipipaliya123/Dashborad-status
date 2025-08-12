const statusList = [
  "all",
  "rto_complete",
  "door_step_exchanged",
  "delivered",
  "cancelled",
  "rto_locked",
  "ready_to_ship",
  "shipped",
  "rto_initiated"
];

function parseNumber(value) {
  if (!value) return 0;
  let num = parseFloat(value.toString().replace(/,/g, '').trim());
  return isNaN(num) ? 0 : num;
}

function categorizeRows(rows) {
  const categories = {};
  statusList.forEach(status => {
    categories[status] = [];
  });
  categories.other = [];

  let totalListedPrice = 0;
  let totalDiscountedPrice = 0;

  rows.forEach(row => {
    const status = (row['Reason for Credit Entry'] || '').toLowerCase().trim();

    const listedPrice = parseNumber(row['Supplier Listed Price (Incl. GST + Commission)']);
    const discountedPrice = parseNumber(row['Supplier Discounted Price (Incl GST and Commision)']);

    totalListedPrice += listedPrice;
    totalDiscountedPrice += discountedPrice;

    categories["all"].push(row);

    let matched = false;
    statusList.forEach(s => {
      if (s !== "all" && status.includes(s)) {
        categories[s].push(row);
        matched = true;
      }
    });

    if (!matched) {
      categories.other.push(row);
    }
  });

  return {
    categories,
    totals: {
      totalListedPrice,
      totalDiscountedPrice
    }
  };
}

module.exports = categorizeRows;
