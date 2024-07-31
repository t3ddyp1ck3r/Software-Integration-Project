import { Request, Response } from 'express';
import MessageModel from '../models/messageModel';

export const addMessage = async (req: Request, res: Response) => {
  const { content, recipientId } = req.body;

  if (!content || !recipientId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newMessage = new MessageModel({ content, recipientId });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Error adding message' });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await MessageModel.find();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
};

export const editMessage = async (req: Request, res: Response) => {
  const { messageId } = req.params;
  const { content } = req.body;
  try {
    const updatedMessage = await MessageModel.findByIdAndUpdate(
      messageId,
      { content },
      { new: true },
    );
    if (!updatedMessage) {
      res.status(404).json({ error: 'Message not found' });
    } else {
      res.status(200).json(updatedMessage);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating message' });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  const { messageId } = req.params;
  try {
    const deletedMessage = await MessageModel.findByIdAndDelete(messageId);
    if (!deletedMessage) {
      res.status(404).json({ error: 'Message not found' });
    } else {
      res.status(200).json({ message: 'Message deleted' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting message' });
  }
};

export const getMessageById = async (req: Request, res: Response) => {
  const { messageId } = req.params;
  try {
    const message = await MessageModel.findById(messageId);
    if (!message) {
      res.status(404).json({ error: 'Message not found' });
    } else {
      res.status(200).json(message);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching message' });
  }
};
