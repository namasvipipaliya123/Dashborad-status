const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

const uploadRoutes = require('./routes/uploadRoutes');
const filterRoutes = require('./routes/filterRoutes');
const submitRoutes = require('./routes/submitRoutes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.use('/', uploadRoutes);
app.use('/', filterRoutes);
app.use('/', submitRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
