require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./src/app.js');
const sequelize = require('./src/config/database.js');

// --- Crash early if critical env vars are missing ---
if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET is not defined in .env');
  console.error('Create a backend/.env file with JWT_SECRET=your_secret_string');
  process.exit(1);
}

// --- Import Models ---
const User = require('./src/models/User');
const SupportRequest = require('./src/models/SupportRequest');
const Organization = require('./src/models/Organization');
const TaskAssignment = require('./src/models/TaskAssignment');
const Event = require('./src/models/Event');
const Notification = require('./src/models/Notification');
const Message = require('./src/models/Message');
const Participation = require('./src/models/Participation');

const PORT = process.env.PORT || 5000;

// --- Define Database Relationships ---
User.hasMany(SupportRequest, { foreignKey: 'citizenId', as: 'requests' });
SupportRequest.belongsTo(User, { foreignKey: 'citizenId', as: 'citizen' });

Organization.hasMany(SupportRequest, { foreignKey: 'organizationId', as: 'managedRequests' });
SupportRequest.belongsTo(Organization, { foreignKey: 'organizationId', as: 'managingOrganization' });

User.hasMany(TaskAssignment, { foreignKey: 'volunteerId', as: 'tasks' });
TaskAssignment.belongsTo(User, { foreignKey: 'volunteerId', as: 'volunteer' });

SupportRequest.hasOne(TaskAssignment, { foreignKey: 'supportRequestId', as: 'taskDetails' });
TaskAssignment.belongsTo(SupportRequest, { foreignKey: 'supportRequestId', as: 'supportRequest' });

Organization.hasMany(Event, { foreignKey: 'organizationId', as: 'events' });
Event.belongsTo(Organization, { foreignKey: 'organizationId', as: 'hostOrganization' });

User.hasOne(Organization, { foreignKey: 'ownerId', as: 'organizationProfile' });
Organization.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// --- EVENT PARTICIPATION RELATIONSHIPS ---
Event.hasMany(Participation, { foreignKey: 'eventId', as: 'participants' });
Participation.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

User.hasMany(Participation, { foreignKey: 'userId', as: 'participations' });
Participation.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// --- CHAT RELATIONSHIPS ---
TaskAssignment.hasMany(Message, { foreignKey: 'taskId', as: 'messages' });
Message.belongsTo(TaskAssignment, { foreignKey: 'taskId', as: 'task' });

User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });


// --- CREATE HTTP SERVER AND ATTACH SOCKET.IO ---
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on('join_task_chat', (taskId) => {
    socket.join(`task_${taskId}`);
    console.log(`User joined chat for task: ${taskId}`);
  });

  socket.on('send_message', async (data) => {
    try {
      const savedMessage = await Message.create({
        text: data.text,
        taskId: data.taskId,
        senderId: data.senderId
      });

      const fullMessage = await Message.findByPk(savedMessage.id, {
        include: [{ model: User, as: 'sender', attributes: ['id', 'name', 'role'] }]
      });

      io.to(`task_${data.taskId}`).emit('receive_message', fullMessage);
    } catch (error) {
      console.error('Error saving socket message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});


sequelize.authenticate()
  .then(() => {
    console.log('MySQL Database connection established successfully.');
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log('Database models synchronized.');

    server.listen(PORT, () => {
      console.log(`=================================`);
      console.log(`LocalAid Server & WebSockets Running!`);
      console.log(`URL: http://localhost:${PORT}`);
      console.log(`=================================`);
    });

  })
  .catch((error) => {
    console.error('Unable to connect to the MySQL database:', error.message);
    process.exit(1);
  });
