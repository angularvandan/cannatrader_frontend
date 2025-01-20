import { DataTypes, Model, Optional } from 'sequelize';
import { db } from '../../config/database';
import { User } from '../@USER_ENTITY/user.model';

// interface ChatAttributes {
//   id: string;
//   userId1: string;  // One user in the chat
//   userId2: string;  // Another user in the chat
// }

// interface ChatCreationAttributes extends Optional<ChatAttributes, 'id'> { }

class Chat extends Model {
  public id!: string;
  public userId1!: string;
  public userId2!: string;
  public user1!: any;
  public user2!: any
  public messages!: any
}

// Initialize the Chat model
Chat.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId1: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  userId2: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  sequelize: db,
  tableName: 'chats',
  timestamps: true,
});

interface MessageAttributes {
  id: string;
  content: string;
  chatId: string;
  senderId: string;
  receiverId: string;  // New field to track who receives the message
  readStatus?: boolean;
}

interface MessageCreationAttributes extends Optional<MessageAttributes, 'id'> { }

class Message extends Model<MessageAttributes, MessageCreationAttributes> implements MessageAttributes {
  public id!: string;
  public content!: string;
  public chatId!: string;
  public senderId!: string;
  public receiverId!: string;  // New field
  public readStatus!: boolean;
}

Message.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  chatId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  receiverId: {  // New field
    type: DataTypes.UUID,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  readStatus: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }
}, {
  sequelize: db,
  tableName: 'message',
  timestamps: true,
});

// Define associations
Chat.belongsTo(User, { as: 'user1', foreignKey: 'userId1' });
Chat.belongsTo(User, { as: 'user2', foreignKey: 'userId2' });
Chat.hasMany(Message, { foreignKey: 'chatId', as: 'messages' })
Message.belongsTo(Chat, { foreignKey: 'chatId' });
User.hasMany(Message, { foreignKey: 'senderId', as: 'user1' })
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'user2' })
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

export { Chat, Message, MessageAttributes };
