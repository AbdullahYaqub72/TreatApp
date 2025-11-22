import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserProfile } from '@/types';

export function useRegisteredUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const usersList: UserProfile[] = [];
        usersSnapshot.forEach((doc) => {
          usersList.push({ id: doc.id, ...doc.data() } as UserProfile);
        });
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading };
}

