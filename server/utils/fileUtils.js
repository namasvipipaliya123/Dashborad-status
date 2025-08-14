const statusList = [
  "all",
  "rto_complete",
  "door_step_exchanged",
  "delivered",
  "cancelled",
  "rto_locked",
  "ready_to_ship",
  "shipped",
  "rto_initiated",
  "supplier_listed_price",
  "supplier_discounted_price"
];

function parsePrice(value) {
  if (!value) return 0;
  let clean = value.toString().trim().replace(/[^0-9.\-]/g, '');
  return parseFloat(clean) || 0;
}

function getColumnValue(row, possibleNames) {
  const keys = Object.keys(row).map(k => k.toLowerCase().trim());
  for (let name of possibleNames) {
    let idx = keys.indexOf(name.toLowerCase().trim());
    if (idx !== -1) {
      return row[Object.keys(row)[idx]];
    }
  }
  return 0;
}

function categorizeRows(rows) {
  const categories = {};
  statusList.forEach(status => {
    categories[status] = [];
  });
  categories.other = [];

  let totalSupplierListedPrice = 0;
  let totalSupplierDiscountedPrice = 0;

  rows.forEach(row => {
    const status = (row['Reason for Credit Entry'] || '').toLowerCase().trim();

    categories["all"].push(row);

    const listedPrice = parsePrice(getColumnValue(row, [
      'Supplier Listed Price (Incl. GST + Commission)',
      'Supplier Listed Price',
      'Listed Price'
    ]));

    const discountedPrice = parsePrice(getColumnValue(row, [
      'Supplier Discounted Price (Incl GST and Commission)',
      'Supplier Discounted Price (Incl GST and Commision)',
      'Supplier Discounted Price',
      'Discounted Price'
    ]));

    totalSupplierListedPrice += listedPrice;
    totalSupplierDiscountedPrice += discountedPrice;

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

  categories.totals = {
    totalSupplierListedPrice,
    totalSupplierDiscountedPrice
  };

  return categories;
}

module.exports = { parsePrice, getColumnValue, categorizeRows, statusList };
