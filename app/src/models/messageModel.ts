import { Schema, model } from 'mongoose';

interface IMessage {
  content: string;
  recipientId: string;
}

const messageSchema = new Schema<IMessage>({
  content: { type: String, required: true },
  recipientId: { type: String, required: true },
});

const MessageModel = model<IMessage>('Message', messageSchema);

export default MessageModel;
