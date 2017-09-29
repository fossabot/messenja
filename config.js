const path = process.cwd();
try {
  const config = require(path + "/config.json");
  module.exports = config;
} catch (e) {
  console.log(
    "No config file. Please create one in the root directory with:\n"
  );
  console.log(require(__dirname + "/config.example.json"));
  process.exit();
}
