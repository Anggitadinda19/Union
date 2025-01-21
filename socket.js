const connectedUsers = {};
const socketHandler = (io) => {
  io.on("connection", (socket) => {
    // console.log("User connected", socket.id);
    socket.on("joinRoom", (userId) => {
      // console.log("Identifying user", userId);
      connectedUsers[userId] = socket.id; // Simpan koneksi berdasarkan userId
    });
    // socket.on("joinRoom", (userId) => {
    //   console.log("Joining room for user", userId);
    //   socket.join(userId);
    //   // if (listId.includes(userId) === false) {
    //   //   console.log("Joining room for user", userId);
    //   //   socket.join(userId);
    //   //   listId.push(userId); // Simpan informasi bahwa user sudah bergabung ke room
    //   //   console.log(listId, ">>>>>>>>");
    //   // } else {
    //   //   // Jika user mencoba bergabung dari koneksi lain, tanggapi di sini
    //   //   console.log(listId, "???????????");
    //   //   console.log("User Id exist");
    //   //   // Lakukan penanganan sesuai kebutuhan aplikasi Anda
    //   // }
    // });

    // socket.on("sendNotification", ({ userId, notification }) => {
    //   io.to(userId).emit("notif", notification);
    //   console.log(`Notification sent to user ${userId}: ${notification}`);
    // });

    socket.on("disconnect", () => {
      // console.log("User disconnected");
    });
  });

  global.io = io;
};

module.exports = { socketHandler, connectedUsers };
