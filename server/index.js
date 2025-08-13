const express = require('express');
const cors = require('cors');

const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use('/', uploadRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
