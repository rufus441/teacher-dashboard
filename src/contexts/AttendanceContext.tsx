import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: Date;
  status: 'present' | 'absent' | 'late';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AttendanceContextType {
  records: AttendanceRecord[];
  loading: boolean;
  addRecord: (record: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRecord: (id: string, record: Partial<AttendanceRecord>) => Promise<void>;
  deleteRecord: (id: string) => Promise<void>;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
};

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecords = async () => {
      if (!user) return;

      try {
        const recordsSnapshot = await getDocs(collection(db, 'attendance'));
        const recordsData = recordsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().date?.toDate(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        })) as AttendanceRecord[];
        setRecords(recordsData);
      } catch (error) {
        console.error('Error fetching attendance records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [user]);

  const addRecord = async (record: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const docRef = await addDoc(collection(db, 'attendance'), {
        ...record,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      setRecords(prev => [...prev, { ...record, id: docRef.id, createdAt: new Date(), updatedAt: new Date() }]);
    } catch (error) {
      console.error('Error adding attendance record:', error);
      throw error;
    }
  };

  const updateRecord = async (id: string, record: Partial<AttendanceRecord>) => {
    try {
      await updateDoc(doc(db, 'attendance', id), {
        ...record,
        updatedAt: new Date()
      });
      setRecords(prev => prev.map(r => r.id === id ? { ...r, ...record, updatedAt: new Date() } : r));
    } catch (error) {
      console.error('Error updating attendance record:', error);
      throw error;
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'attendance', id));
      setRecords(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error('Error deleting attendance record:', error);
      throw error;
    }
  };

  return (
    <AttendanceContext.Provider value={{ records, loading, addRecord, updateRecord, deleteRecord }}>
      {children}
    </AttendanceContext.Provider>
  );
}; 