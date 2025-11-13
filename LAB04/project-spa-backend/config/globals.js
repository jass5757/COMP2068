const configurations = {
    ConnectionStrings: {
        MongoDB: process.env.MONGODB_URI || "mongodb://localhost:27017/project_tracker_db"
    },
    ClientServer: "http://localhost:4200"
};

module.exports = configurations;