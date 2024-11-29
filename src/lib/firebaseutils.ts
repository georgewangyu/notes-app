import { 
    collection, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    onSnapshot,
    where,
    orderBy
  } from 'firebase/firestore';
  import { db } from './firebase'
  
  // Define the Note interface
  export interface Note {
    id: string;
    title: string;
    content: string;
    category: string;
    authors: string;
    date: string;
    color: string;
    borderColor: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export const addNote = async (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'notes'), {
        ...note,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  };
  
  export const subscribeToNotes = (callback: (notes: Note[]) => void) => {
    const q = query(
      collection(db, 'notes'), 
      orderBy('createdAt', 'desc')
    );
  
    return onSnapshot(q, (snapshot) => {
      const notes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Note[];
      callback(notes);
    });
  };
  
  export const updateNote = async (id: string, data: Partial<Note>) => {
    try {
      const noteRef = doc(db, 'notes', id);
      await updateDoc(noteRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  };
  
  export const deleteNote = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'notes', id));
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  };